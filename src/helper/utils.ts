import axios from 'axios';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import config from './config';
import log from './logger';

export default class Utils {
	static async hashPassword(password: string) {
		const salt = await bcrypt.genSalt(10);
		return bcrypt.hash(password, salt);
	}

	static createDefaultPassword() {
		return uuidv4().slice(0, 6);
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

	static async validateReCaptchaToken(token: string) {
		try {
			const res = await axios({
				method: 'GET',
				url: `https://www.google.com/recaptcha/api/siteverify?secret=${config.GOOGLE_CAPTCHA_KEY}&response=${token}`,
			});
			return res.data.success;
		} catch (err) {
			log.error(err);
			return false;
		}
	}

	static logoutUser(req: Request, res: Response, _next: NextFunction) {
		req.session.destroy(() => {
			res.clearCookie(config.SESSION.NAME);
			res.redirect('/');
		});

		return;
	}

	static getMessageChoices(userFirstName: string, childFirstName: string) {
		if (!userFirstName || !childFirstName) {
			return [];
		}

		return [
			`May love and happiness be yours this holiday season.`,
			`Have a lovely festive season.`,
			`Sending lots of peace and joy your way this season.`,
			`${childFirstName}, Have a lovely Christmas!`,
			`${userFirstName} sends you love, ${childFirstName}.`,
			`${userFirstName} wishes you a happy Hanukkah!`,
			`${userFirstName} wishes you a merry Christmas!`,
			`${userFirstName} wishes you happy holidays!`,
			`${childFirstName}, I hope the season is treating you well.`,
			`Merry Christmas, ${childFirstName}`,
			`Happy holidays, ${childFirstName}`,
			'Merry Christmas and a Happy New Year.',
			`${childFirstName}, have a happy holiday.`,
			`${childFirstName}, you are awesome!`,
			`Lots of love and best wishes, ${childFirstName}.`,
			`${childFirstName}, we love you and we want you to know that! You are amazing!`,
			`${childFirstName}, hope you enjoy my gift!`,
			'Happy holidays to the sweetest kid in the entire world.',
		];
	}

	static createEmailVerificationHash() {
		let result = '';
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		for (let i = 0; i < 18; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}

		return result;
	}

	static extractProductIDFromLink(url: string) {
		const amazonProductIDRegex = /\/dp\/([A-Z0-9]{10})/;
		const match = url.match(amazonProductIDRegex);
		if (match === null) {
			throw new Error(`Could not get product id from link: ${url}`);
		}
		return match[1];
	}

	static ensureProtocol(url: string) {
		if (!url.startsWith('http://') && !url.startsWith('https://')) {
			return 'http://' + url;
		}
		return url;
	}
}
