import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { formatUsername } from '../utils/formats.util';
import { isPasscode, isUsername } from '../utils/checks.util';
import DB from '../services/db.service';
import { genHash } from '../utils/crypt.util';

export const createUser = async (ctx: Context, _next: Next) => {
  const { username, passcode } = ctx.request.body;

  if (!isUsername(username) || !isPasscode(passcode)) {
    ctx.status = StatusCodes.BAD_REQUEST;
    return;
  }
  
  try {
    ctx.body = await DB.getInstance().user.create({
      data: {
        username: formatUsername(username),
        passcode: await genHash(passcode)
      },
      select: {
        id: true,
        username: true,
        passcode: false // Exclude the passcode hash
      }
    });
    ctx.status = StatusCodes.CREATED;
  } catch (err: PrismaClientKnownRequestError | any) {
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
};
