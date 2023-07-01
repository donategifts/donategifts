import bodyParser from 'body-parser';
import express from 'express';

import PaymentProviderController from '../controller/paymentProvider';
import Permissions from '../middleware/permissions';

const router = express.Router();
const paymentProviderController = new PaymentProviderController();

router.use(paymentProviderController.limiter);

router.post(
	'/webhook',
	bodyParser.raw({ type: 'application/json' }),
	paymentProviderController.handlePostWebhook,
);

router.use(Permissions.redirectLogin);

router.post('/createIntent', paymentProviderController.handlePostCreateIntent);

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get('/success/:id&:totalAmount', paymentProviderController.handleGetPaymentSuccess);

export default router;
