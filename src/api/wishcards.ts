import express from 'express';

import WishCardController from '../controller/wishcard';

const router = express.Router();
const wishCardController = new WishCardController();

router.get('/random', wishCardController.handleGetRandom);

export default router;
