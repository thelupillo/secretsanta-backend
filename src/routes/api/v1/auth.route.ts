import Router from '@koa/router';
import { loginUser } from '../../../controllers/auth.controller';

const authRouter = new Router({ prefix: '/auth' });

// 'POST /api/v1/auth/login'
authRouter.post('/login', loginUser);

export default authRouter;
