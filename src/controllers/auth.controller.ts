import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { isUsername, isPasscode } from '../utils/checks.util';
import DB from '../services/db.service';
import { formatUsername } from '../utils/formats.util';
import { compareHash } from '../utils/crypt.util';
import { signRefreshToken, signAccessToken } from '../utils/jwt.util';
import { setTokenCookie } from '../utils/cookies.util';

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
  } catch (err) {
    ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
    console.error(err);
    return;
  }

  // Validate credentials
  if (!user || !await compareHash(passcode, user.passcode)) {
    ctx.status = StatusCodes.NOT_FOUND;
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
  } catch (err: PrismaClientKnownRequestError | any) {
    // TODO: Add an error handler function to manage all kind of errors
    switch (err.code) {
      case "P2002": // ErrorCode when there is a conflict (already exists)
        ctx.status = StatusCodes.CONFLICT;
        break;

      default:
        ctx.status = StatusCodes.INTERNAL_SERVER_ERROR;
        console.error(err);
        break;
    }
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
