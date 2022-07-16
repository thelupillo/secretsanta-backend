import { Context, Next } from 'koa';
import { StatusCodes } from 'http-status-codes';
import { nanoid } from 'nanoid';

import { getTokenCookie } from '../utils/cookies.util';
import { verifyAccessToken } from '../utils/jwt.util';
import DB from '../services/db.service';
import { prismaErrorHandler } from '../utils/prisma.util';

const LOTTERY_MAX_COUNT = 5;
const LOTTERY_ID_LENGTH = 10;

export const createLottery = async (ctx: Context, _next: Next) => {
  const { name } = ctx.request.body;
  const { userId } = verifyAccessToken(getTokenCookie(ctx.cookies)!);

  try {
    // Limit the lottery to LOTTERY_MAX_COUNT per user
    const count = await DB.getInstance().lottery.count({
      where: {
        creatorId: userId
      }
    });
    if (count >= LOTTERY_MAX_COUNT) {
      ctx.status = StatusCodes.CONFLICT;
      return;
    }

    const lottery = await DB.getInstance().lottery.create({
      data: {
        id: nanoid(LOTTERY_ID_LENGTH),
        name,
        creatorId: userId
      }
    });

    await DB.getInstance().lotteryParticipant.create({
      data: {
        lotteryId: lottery.id,
        userId: userId
      }
    });

    ctx.body = lottery;
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

};

export const deleteLottery = async (ctx: Context, _next: Next) => {
  const { id } = ctx.params;

  try {
    await DB.getInstance().lotteryParticipant.deleteMany({
      where: {
        lotteryId: id
      }
    });

    await DB.getInstance().lottery.delete({
      where: {
        id
      }
    });

    ctx.status = StatusCodes.OK;
  } catch (error) {
    ctx.status = prismaErrorHandler(error);
    return;
  }

};
