import express from 'express';

import PaymentProviderController from './controller/payment';

const router = express.Router();
const paymentProviderController = new PaymentProviderController();

router.post('/create-intent', paymentProviderController.handlePostCreateIntent);

router.post('/webhook-stripe', paymentProviderController.handlePostStripeWebhook);

router.post('/webhook-paypal', paymentProviderController.handlePostPaypalWebhook);

export default router;
