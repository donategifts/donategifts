/* eslint-disable no-case-declarations */
const express = require('express');
const bodyParser = require('body-parser');

const MiddleWare = require('../middleware');
const PaymentProviderHandler = require('../handler/paymentprovider');

const router = express.Router();
const paymentProviderHandler = new PaymentProviderHandler();

router.post(
	'/createIntent',
	MiddleWare.redirectLogin,
	paymentProviderHandler.handlePostCreateIntent,
);

router.post(
	'/webhook',
	bodyParser.raw({ type: 'application/json' }),
	paymentProviderHandler.handlePostWebhook,
);

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get(
	'/success/:id&:totalAmount',
	MiddleWare.redirectLogin,
	paymentProviderHandler.handleGetPaymentSuccess,
);

module.exports = router;
