import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';

import { formatUsername } from '../utils/formats.util';
import { isPasscode, isUsername } from '../utils/checks.util';
import DB from '../services/db.service';
import { generateHash } from '../utils/cypher.util';
import { prismaErrorHandler } from '../utils/prisma.util';

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
        passcode: await generateHash(passcode)
      },
      select: {
        id: true,
        username: true,
        passcode: false // Exclude the passcode hash
      }
    });
    ctx.status = StatusCodes.CREATED;
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }
};
