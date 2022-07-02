import Router from '@koa/router';
import { Context, Next } from 'koa';
const router = new Router();

router.all('/', async (ctx: Context, _next: Next) => {
  ctx.body = JSON.stringify({
    message: "Secret Santa"
  });
});

export default router;
