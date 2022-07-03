import Router from '@koa/router';
import { Context } from 'koa';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

const healthRouter = new Router({ prefix: '/health' });

// 'GET /health'
healthRouter.get('/', (ctx: Context) => {
  ctx.status = StatusCodes.OK;
  ctx.body = {
    statusCode: StatusCodes.OK,
    message: ReasonPhrases.OK,
    timestamp: new Date()
  };
});

export default healthRouter;
