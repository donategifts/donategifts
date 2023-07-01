import bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import UserRepository from '../db/repository/UserRepository';
import Utils from '../helper/utils';

import BaseController from './basecontroller';

export default class LoginController extends BaseController {
	private userRepository: UserRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostIndex = this.handlePostIndex.bind(this);
		this.handlePostGoogleLogin = this.handlePostGoogleLogin.bind(this);
	}

	handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'login');
	}

	async handlePostIndex(req: Request, res: Response, _next: NextFunction) {
		const { email, password } = req.body;
		const user = await this.userRepository.getUserByEmail(email.toLowerCase());
		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				if (req) {
					req.session.user = user;
				} else {
					this.log.warn('req is undefined');
					return this.handleError({ res, code: 500, error: 'Internal Server Error' });
				}

				res.locals.user = user;
				return res.status(200).redirect('/profile');
			}
		}
		this.handleError({ res, code: 403, error: 'Username and/or password incorrect' });
	}

	async handlePostGoogleLogin(req, res, _next) {
		const { id_token } = req.body;

		if (id_token) {
			try {
				const user = await LoginController.verifyGoogleToken(id_token);

				if (user) {
					const fName = user.firstName;
					const lName = user.lastName;
					const email = user.mail.toLowerCase();

					const dbUser = this.userRepository.getUserByEmail(email);

					if (dbUser) {
						if (req) {
							req.session.user = dbUser;
						} else {
							this.log.warn('req is undefined');
							return this.handleError({
								res,
								code: 500,
								error: 'Internal Server Error',
							});
						}

						res.locals.user = dbUser;

						return res.status(200).send({
							url: '/profile',
						});
					}

					const newUser = this.userRepository.createNewUser({
						fName,
						lName,
						email,
						password: Utils.createDefaultPassword(),
						verificationHash: Utils.createEmailVerificationHash(),
						userRole: 'donor',
						loginMode: 'Google',
						emailVerified: true,
					});

					if (req) {
						req.session.user = newUser;
					} else {
						this.log.warn('req is undefined');
						return this.handleError({
							res,
							code: 500,
							error: 'Internal Server Error',
						});
					}

					res.locals.user = newUser;
					return res.status(200).send({
						url: '/profile',
					});
				}
			} catch (error) {
				return this.handleError({
					res,
					code: 400,
					error: 'Error during login!\nTry again in a few minutes!',
				});
			}
		}

		return this.handleError({
			res,
			code: 400,
			error: 'Error during login!\nTry again in a few minutes!',
		});
	}

	async handlePostFacebookLogin(req, res, _next) {
		const { userName, email } = req.body;

		if (userName && email) {
			const [fName, lName] = userName.split(' ');

			const dbUser = this.userRepository.getUserByEmail(email.toLowerCase());

			if (dbUser) {
				req.session.user = dbUser;
				res.locals.user = dbUser;
				return res.status(200).send({
					url: '/profile',
				});
			}

			try {
				const newUser = this.userRepository.createNewUser({
					fName,
					lName: lName || 'LastnameUnset',
					email: email.toLowerCase(),
					password: Utils.createDefaultPassword(),
					verificationHash: Utils.createEmailVerificationHash(),
					userRole: 'donor',
					loginMode: 'Facebook',
					emailVerified: true,
				});

				req.session.user = newUser;
				res.locals.user = newUser;
				return res.status(200).send({
					url: '/profile',
				});
			} catch (error) {
				return this.handleError({
					res,
					code: 400,
					error: 'Error during login!\nTry again in a few minutes!',
				});
			}
		}

		return this.handleError({
			res,
			code: 400,
			error: 'Error during login!\nTry again in a few minutes!',
		});
	}

	static async verifyGoogleToken(token) {
		const oauthClient = new OAuth2Client(process.env.G_CLIENT_ID);
		const ticket = await oauthClient.verifyIdToken({
			idToken: token,
			audience: process.env.G_CLIENT_ID,
		});
		const payload = ticket.getPayload();
		return {
			firstName: payload?.given_name || 'FirstNameUnset',
			lastName: payload?.family_name || 'LastNameUnset',
			mail: payload?.email || 'EmailUnset',
		};
	}
}
