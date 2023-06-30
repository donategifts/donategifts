const bodyParser = require('body-parser');
const express = require('express');

const PaymentProviderController = require('../controller/paymentProvider');
const Permissions = require('../middleware/permissions');

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

module.exports = router;
