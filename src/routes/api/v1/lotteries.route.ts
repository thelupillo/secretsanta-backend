import Router from '@koa/router';
import { verifyAuthentication } from '../../../middlewares/auth.middleware';
import { verifyLotteryOwnership } from '../../../middlewares/lottery.middleware';
import { createLottery, deleteLottery } from '../../../controllers/lotteries.controller';

const lotteriesRouter = new Router({ prefix: '/lotteries' });

// 'POST /api/v1/lotteries/'
lotteriesRouter.post('/', verifyAuthentication, createLottery);
// 'DELETE /api/v1/lotteries/ZZZZZZZZZZ'
lotteriesRouter.delete('/:id', verifyAuthentication, verifyLotteryOwnership, deleteLottery);

export default lotteriesRouter;
