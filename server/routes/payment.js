/* eslint-disable no-case-declarations */
const express = require('express');
const bodyParser = require('body-parser');

const Permissions = require('../middleware/permissions');
const PaymentProviderController = require('../controller/paymentProvider');

const router = express.Router();
const paymentProviderController = new PaymentProviderController();

router.post(
	'/createIntent',
	Permissions.redirectLogin,
	paymentProviderController.handlePostCreateIntent,
);

router.post(
	'/webhook',
	bodyParser.raw({ type: 'application/json' }),
	paymentProviderController.handlePostWebhook,
);

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get(
	'/success/:id&:totalAmount',
	Permissions.redirectLogin,
	paymentProviderController.handleGetPaymentSuccess,
);

module.exports = router;
