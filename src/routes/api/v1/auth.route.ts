import Router from '@koa/router';
import { loginUser, logoutUser, refreshAuth } from '../../../controllers/auth.controller';

const authRouter = new Router({ prefix: '/auth' });

// 'POST /api/v1/auth/login'
authRouter.post('/login', loginUser);
// 'POST /api/v1/auth/logout'
authRouter.post('/logout', logoutUser);
// 'POST /api/v1/auth/refresh'
authRouter.post('/refresh', refreshAuth);

export default authRouter;
