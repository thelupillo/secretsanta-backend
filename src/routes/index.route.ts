import Router from '@koa/router';

const router: Router = new Router();

import { apiV1Router } from './api/api.route';
router.use(apiV1Router.routes(), apiV1Router.allowedMethods());

export default router;
