import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { AuthSession } from '@prisma/client';
import { TokenPayload } from '../types';

import { isUsername, isPasscode } from '../utils/checks.util';
import DB from '../services/db.service';
import { formatUsername } from '../utils/formats.util';
import { compareHash } from '../utils/cypher.util';
import { signRefreshToken, signAccessToken, verifyRefreshToken } from '../utils/jwt.util';
import { setTokenCookie, clearTokenCookie } from '../utils/cookies.util';
import { prismaErrorHandler } from '../utils/prisma.util';

export const loginUser = async (ctx: Context, _next: Next) => {
  const { username, passcode } = ctx.request.body;

  if (!isUsername(username) || !isPasscode(passcode)) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  // Search the user in the database
  let user = undefined;
  try {
    user = await DB.getInstance().user.findUnique({
      where: {
        username: formatUsername(username)
      },
      select: {
        id: true,
        username: true,
        passcode: true
      }
    });
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

  // Validate credentials
  if (!user || !await compareHash(passcode, user.passcode)) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  const tokenPayload: TokenPayload = { userId: user.id };
  const refreshToken = signRefreshToken(tokenPayload);

  // Save the session (refreshToken) in the database
  try {
    await DB.getInstance().authSession.create({
      data: {
        userId: user.id,
        token: refreshToken
      }
    });
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

  setTokenCookie(ctx.cookies, signAccessToken(tokenPayload));

  ctx.body = {
    user: {
      id: user.id,
      username: user.username
    },
    refreshToken
  };
};

export const logoutUser = async (ctx: Context, _next: Next) => {
  const { refreshToken } = ctx.request.body;

  if (!refreshToken) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  // Verify that the refresh token is valid
  try {
    verifyRefreshToken(refreshToken);
  } catch(error) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  // Delete the session (refreshToken) from the database
  try {
    await DB.getInstance().authSession.delete({
      where: {
        token: refreshToken
      }
    });
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

  clearTokenCookie(ctx.cookies);
  ctx.status = StatusCodes.OK;
};

export const refreshAuth = async (ctx: Context, _next: Next) => {
  const { refreshToken } = ctx.request.body;

  if (!refreshToken) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  // Verify that the refreshToken is valid and get the payload
  let refreshTokenPayload: TokenPayload | JwtPayload | undefined = undefined;
  try {
    refreshTokenPayload = verifyRefreshToken(refreshToken);
  } catch(error) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  if (!refreshTokenPayload) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  } 

  // Verify that the session (refreshToken) still exists
  let authSession: AuthSession | null;
  try {
    authSession = await DB.getInstance().authSession.findFirst({
      where: {
        AND: {
          userId: refreshTokenPayload.userId,
          token: refreshToken
        }
      }
    });
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

  if (!authSession) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  } 

  // Sign a new access token and set a cookie for it
  setTokenCookie(ctx.cookies, signAccessToken({ userId: refreshTokenPayload.userId }));
  ctx.status = StatusCodes.OK;
};
