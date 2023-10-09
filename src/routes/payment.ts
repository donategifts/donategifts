import express from 'express';

import PaymentProviderController from '../controller/paymentProvider';
import Permissions from '../middleware/permissions';

const router = express.Router();
const paymentProviderController = new PaymentProviderController();

router.post('/webhook', paymentProviderController.handlePostWebhook);

router.post(
	'/createIntent',
	Permissions.redirectLogin,
	paymentProviderController.handlePostCreateIntent,
);

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get(
	'/success/:id&:totalAmount',
	Permissions.redirectLogin,
	paymentProviderController.handleGetPaymentSuccess,
);

export default router;
