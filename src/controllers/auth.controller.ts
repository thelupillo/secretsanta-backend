import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';

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
  var user = null;
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

  const payloadToken = { id: user.id };
  const refreshToken = signRefreshToken(payloadToken);

  // Save the session (token) in the database
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

  setTokenCookie(ctx.cookies, signAccessToken(payloadToken));

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

  var tokenPayload = undefined;
  try {
    tokenPayload = verifyRefreshToken(refreshToken);
  } catch(error) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

  if (!refreshToken && !tokenPayload) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }

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
