const bcrypt = require('bcrypt');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');

const log = require('./logger');

module.exports = class Utils {
	static async verifyGoogleToken(token) {
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

	static async hashPassword(password) {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	static createDefaultPassword() {
		return Math.random().toString(36).slice(-8);
	}

	static async calculateWishItemTotalPrice(itemPrice) {
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

	static async validateReCaptchaToken(token) {
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

	static logoutUser(req, res, _next) {
		req.session.destroy(() => {
			res.clearCookie(process.env.SESS_NAME);
			res.redirect('/login');
		});
	}

	static getMessageChoices(userFirstName, childFirstName) {
		if (!userFirstName || !childFirstName) {
			return [];
		}

		return [
			`${userFirstName} sends you love, ${childFirstName}.`,
			`${userFirstName} wishes you a happy Hanukkah!`,
			`${userFirstName} wishes you a merry Christmas!`,
			`${userFirstName} wishes you happy holidays!`,
			`Merry Christmas, ${childFirstName}`,
			`Happy holidays, ${childFirstName}`,
			'Merry Christmas and a Happy New Year',
			`${childFirstName}, have a happy holiday`,
			`${childFirstName}, you are awesome!`,
			`Lots of love and best wishes, ${childFirstName}`,
			`${childFirstName}, we love you and we want you to know that! You are amazing!`,
			`${childFirstName}, hope you enjoy my gift!`,
			'Happy birthday to the sweetest kid in the entire world.',
			`Happy birthday, ${childFirstName}`,
			`Congratulations, ${childFirstName}`,
		];
	}
};
