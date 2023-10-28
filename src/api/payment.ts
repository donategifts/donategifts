import express from 'express';

import { database } from '../db/postgresconnection';

import PaymentProviderController from './controller/payment';

const router = express.Router();
const paymentProviderController = new PaymentProviderController(database);

router.post('/create-intent', paymentProviderController.handlePostCreateIntent);

router.post('/webhook-stripe', paymentProviderController.handlePostStripeWebhook);

router.post('/webhook-paypal', paymentProviderController.handlePostPaypalWebhook);

export default router;
