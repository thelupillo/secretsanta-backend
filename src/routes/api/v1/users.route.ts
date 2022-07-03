import Router from '@koa/router';
import { createUser } from '../../../controllers/users.controller';

const usersRouter = new Router({ prefix: '/users' });

// 'POST /api/v1/users'
usersRouter.post('/', createUser);

export default usersRouter;
