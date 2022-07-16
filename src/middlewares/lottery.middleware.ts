import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';

import { verifyAccessToken } from '../utils/jwt.util';
import { getTokenCookie } from '../utils/cookies.util';
import { prismaErrorHandler } from '../utils/prisma.util';
import DB from '../services/db.service';

export const verifyLotteryOwnership = async (ctx: Context, next: Next) => {
  const { id } = ctx.params;
  const { userId } = verifyAccessToken(getTokenCookie(ctx.cookies)!);

  try {
    const lottery = await DB.getInstance().lottery.findUnique({
      where: {
        id
      }
    });
    if (!lottery || lottery.creatorId !== userId) {
      ctx.status = StatusCodes.FORBIDDEN;
      return;
    }
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

  await next();
};
