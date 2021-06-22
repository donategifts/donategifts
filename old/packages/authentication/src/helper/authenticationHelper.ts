import { hash, genSalt } from 'bcrypt';
import { OAuth2Client } from 'google-auth-library';
import * as superagent from 'superagent';
import { logger } from '@donategifts/helper';

async function verifyGoogleToken(
	token: string,
): Promise<{
	firstName?: string;
	lastName: string;
	mail?: string;
}> {
	const oauthClient = new OAuth2Client(process.env.G_CLIENT_ID);
	const ticket = await oauthClient.verifyIdToken({
		idToken: token,
		audience: process.env.G_CLIENT_ID,
	});
	const payload = ticket.getPayload();
	return {
		firstName: payload?.given_name,
		lastName: payload?.family_name || 'LastnameUnset',
		mail: payload?.email,
	};
}

async function hashPassword(password: string): Promise<string> {
	const salt = await genSalt(10);
	return hash(password, salt);
}

function createDefaultPassword(): string {
	return Math.random().toString(36).slice(-8);
}

async function validateReCaptchaToken(token: string): Promise<boolean> {
	if (process.env.NODE_ENV !== 'production') {
		return true;
	}
	const googleUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.GOOGLE_CAPTCHA_KEY}&response=${token}`;
	return (async () => {
		try {
			const res = await superagent.post(googleUrl);
			return res.body.success;
		} catch (err) {
			logger.error(err);
			return false;
		}
	})();
}

export { verifyGoogleToken, hashPassword, createDefaultPassword, validateReCaptchaToken };
