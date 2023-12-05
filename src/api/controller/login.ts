import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import UserRepository from '../../db/repository/UserRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import config from '../../helper/config';
import Utils from '../../helper/utils';

import BaseController from './basecontroller';

export default class LoginController extends BaseController {
	private userRepository: UserRepository;

	private wishCardRepository: WishCardRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();
		this.wishCardRepository = new WishCardRepository();
	}

	async handlePostIndex(req: Request, res: Response, _next: NextFunction) {
		const { email, password, redirect } = req.body;
		const user = await this.userRepository.getUserByEmail(email.toLowerCase());
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				req.session.user = user;

				if (redirect) {
					const result = await this.wishCardRepository.getWishCardById(redirect);

					if (result) {
						return this.sendResponse(res, { url: `/wishcards/donate/${redirect}` });
					}
				}

				return this.sendResponse(res, { url: '/profile' });
			}
		}

		return this.sendResponse(res, { error: 'Username and/or password incorrect' }, 403);
	}

	async handlePostGoogleLogin(req: Request, res: Response, _next: NextFunction) {
		const { id_token, redirect } = req.body;

		if (id_token) {
			try {
				const result = await LoginController.verifyGoogleToken(id_token);

				if (result) {
					const fName = result.firstName;
					const lName = result.lastName;
					const email = result.mail.toLowerCase();

					const user = await this.userRepository.getUserByEmail(email);

					if (user) {
						req.session.user = user;
					} else {
						req.session.user = await this.userRepository.createNewUser({
							fName,
							lName,
							email,
							password: Utils.createDefaultPassword(),
							verificationHash: Utils.createEmailVerificationHash(),
							userRole: 'donor',
							loginMode: 'Google',
							emailVerified: true,
						});
					}

					if (redirect) {
						const result = await this.wishCardRepository.getWishCardById(redirect);

						if (result) {
							return this.sendResponse(res, { url: `/wishcards/donate/${redirect}` });
						}
					}

					return this.sendResponse(res, {
						url: '/profile',
					});
				}
			} catch (error) {
				return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
			}
		}

		return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
	}

	async handlePostFacebookLogin(req: Request, res: Response, _next: NextFunction) {
		const { userName, email } = req.body;

		if (userName && email) {
			const [fName, lName] = userName.split(' ');

			const dbUser = await this.userRepository.getUserByEmail(email.toLowerCase());

			if (dbUser) {
				if (req) {
					req.session.user = dbUser;
					return res.status(200).send({
						url: '/profile',
					});
				} else {
					return this.handleError(res, 'request already ended', 500);
				}
			}

			try {
				const newUser = await this.userRepository.createNewUser({
					fName,
					lName: lName || 'LastnameUnset',
					email: email.toLowerCase(),
					password: Utils.createDefaultPassword(),
					verificationHash: Utils.createEmailVerificationHash(),
					userRole: 'donor',
					loginMode: 'Facebook',
					emailVerified: true,
				});

				if (req) {
					req.session.user = newUser;
					return res.status(200).send({
						url: '/profile',
					});
				} else {
					return this.handleError(res, 'request already ended', 500);
				}
			} catch (error) {
				return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
			}
		}

		return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
	}

	static async verifyGoogleToken(token: string) {
		const oauthClient = new OAuth2Client(config.G_CLIENT_ID ? config.G_CLIENT_ID : undefined);
		const ticket = await oauthClient.verifyIdToken({
			idToken: token,
			audience: config.G_CLIENT_ID ? config.G_CLIENT_ID : undefined,
		});
		const payload = ticket.getPayload();
		return {
			firstName: payload?.given_name || 'FirstNameUnset',
			lastName: payload?.family_name || 'LastNameUnset',
			mail: payload?.email || 'EmailUnset',
		};
	}
}
