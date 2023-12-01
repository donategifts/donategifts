import express from 'express';

import PaymentController from './controller/payment';

const router = express.Router();
const paymentController = new PaymentController();

router.get('/success', paymentController.handleGetPaymentSuccess);

export default router;
