import Router from '@koa/router';

export const apiV1Router: Router = new Router({ prefix: '/api/v1' });

import authRouter from './v1/auth.route';
apiV1Router.use(authRouter.routes(), authRouter.allowedMethods());

import usersRouter from './v1/users.route';
apiV1Router.use(usersRouter.routes(), usersRouter.allowedMethods());

import lotteriesRouter from './v1/lotteries.route';
apiV1Router.use(lotteriesRouter.routes(), lotteriesRouter.allowedMethods());
