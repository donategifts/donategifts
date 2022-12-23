/* eslint-disable no-case-declarations */
const express = require('express');
const bodyParser = require('body-parser');

const { redirectLogin } = require('./middleware/login.middleware');
const PaymentProviderHandler = require('../handler/paymentProvider');

const router = express.Router();
const paymentProviderHandler = new PaymentProviderHandler();

router.post('/createIntent', redirectLogin, paymentProviderHandler.handlePostCreateIntent);

router.post(
	'/webhook',
	bodyParser.raw({ type: 'application/json' }),
	paymentProviderHandler.handlePostWebhook,
);

// called from frontend after stripe payment confirmation
// redirect to a thank you page
router.get(
	'/success/:id&:totalAmount',
	redirectLogin,
	paymentProviderHandler.handleGetPaymentSuccess,
);

module.exports = router;
