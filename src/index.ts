import 'dotenv/config';
import Koa from 'koa';
import cors from '@koa/cors';
import logger from 'koa-logger';
import bodyParser from 'koa-body';

const app: Koa = new Koa();

app.use(cors());
app.use(logger());
app.use(bodyParser());

import router from './routes/index.route';
app.use(router.routes());
app.use(router.allowedMethods());

app.listen({ port: process.env.SERVER_PORT }, () => {
  console.log(`Listening on port ${process.env.SERVER_PORT}`);
});
