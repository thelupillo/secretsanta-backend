import Router from '@koa/router';
import { loginUser, logoutUser } from '../../../controllers/auth.controller';

const authRouter = new Router({ prefix: '/auth' });

// 'POST /api/v1/auth/login'
authRouter.post('/login', loginUser);
// 'POST /api/v1/auth/logout'
authRouter.post('/logout', logoutUser);

export default authRouter;
