const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const log = require('./logger');

async function verifyGoogleToken(token) {
	const oauthClient = new OAuth2Client(process.env.G_CLIENT_ID);
	const ticket = await oauthClient.verifyIdToken({
		idToken: token,
		audience: process.env.G_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	return {
		firstName: payload.given_name,
		lastName: payload.family_name || 'LastnameUnset',
		mail: payload.email,
	};
}

async function hashPassword(password) {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
}

function createDefaultPassword() {
	return Math.random().toString(36).slice(-8);
}

async function calculateWishItemTotalPrice(itemPrice) {
	// fee for processing item. 3% charged by stripe for processing each card trasaction + 5% from us to cover the possible item price change difference
	const PROCESSING_FEE = 1.08;
	// Open for discussion. Each state has its own tax so maybe create values for each individual(key-value) or use a defined one for everything since we are
	// doing all the shopping
	const TAX = 1.0712;
	const processingItemFee = itemPrice * PROCESSING_FEE - itemPrice;
	const itemTax = itemPrice * TAX - itemPrice;
	const totalPrice = itemPrice + itemTax + processingItemFee;
	const roundTotalPrice = totalPrice.toFixed(2);
	return roundTotalPrice;
}

async function validateReCaptchaToken(token) {
	if (process.env.NODE_ENV !== 'production') {
		return true;
	}

	try {
		const res = await axios({
			method: 'GET',
			url: `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_KEY}&response=${token}`,
		});
		return res.data.success;
	} catch (err) {
		log.error(err);
		return false;
	}
}

module.exports = {
	verifyGoogleToken,
	hashPassword,
	createDefaultPassword,
	calculateWishItemTotalPrice,
	validateReCaptchaToken,
};
