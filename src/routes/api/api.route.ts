import Router from '@koa/router';

export const apiV1Router: Router = new Router({ prefix: '/api/v1' });

import usersRouter from './v1/users.route';
apiV1Router.use(usersRouter.routes(), usersRouter.allowedMethods());
