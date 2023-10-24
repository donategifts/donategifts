import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { Kysely } from 'kysely';

import UsersRepository from '../../db/repository/postgres/UsersRepository';
import { DB } from '../../db/types/generated/database';
import config from '../../helper/config';
import Utils from '../../helper/utils';

import BaseController from './basecontroller';

export default class LoginController extends BaseController {
	private readonly usersRepository: UsersRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.usersRepository = new UsersRepository(database);
	}

	private async verifyGoogleToken(token: string) {
		const oauthClient = new OAuth2Client(config.G_CLIENT_ID ? config.G_CLIENT_ID : undefined);
		const ticket = await oauthClient.verifyIdToken({
			idToken: token,
			audience: config.G_CLIENT_ID ? config.G_CLIENT_ID : undefined,
		});
		const payload = ticket.getPayload();

		return {
			first_name: payload?.given_name || 'FirstNameUnset',
			last_name: payload?.family_name || 'LastNameUnset',
			email: (payload?.email || 'EmailUnset').toLowerCase(),
		};
	}

	async handlePostIndex(req: Request, res: Response, _next: NextFunction) {
		const { email, password } = req.body;
		const user = await this.usersRepository.getByEmail(email.toLowerCase());

		if (user) {
			if (await bcrypt.compare(password, user.password)) {
				if (req) {
					req.session.user = user;
				} else {
					return this.handleError(res, 'request already ended', 500);
				}

				return this.sendResponse(res, { redirect: '/profile' });
			}
		}

		return this.sendResponse(res, { error: 'Username and/or password incorrect' }, 403);
	}

	async handlePostGoogleLogin(req: Request, res: Response, _next: NextFunction) {
		const { id_token } = req.body;

		if (id_token) {
			try {
				const { first_name, last_name, email } = await this.verifyGoogleToken(id_token);

				const potentialUser = await this.usersRepository.getByEmail(email);

				if (potentialUser) {
					req.session.user = potentialUser;

					return res.status(200).send({
						url: '/profile',
					});
				}

				const { user: newUser } = await this.usersRepository.create(
					{
						first_name,
						last_name,
						email,
						password: Utils.createDefaultPassword(),
						role: 'donor',
						login_mode: 'google',
						bio: '',
						image_id: null,
					},
					'email',
				);

				req.session.user = newUser;

				return res.status(200).send({
					url: '/profile',
				});
			} catch (error) {
				return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
			}
		}

		return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
	}

	async handlePostFacebookLogin(req: Request, res: Response, _next: NextFunction) {
		const { userName, email } = req.body;

		if (userName && email) {
			const [first_name, last_name] = userName.split(' ');

			const potentialUser = await this.usersRepository.getByEmail(email.toLowerCase());

			if (potentialUser) {
				req.session.user = potentialUser;

				return res.status(200).send({
					url: '/profile',
				});
			}

			try {
				const { user: newUser } = await this.usersRepository.create(
					{
						first_name,
						last_name: last_name || 'LastnameUnset',
						email: email.toLowerCase(),
						password: Utils.createDefaultPassword(),
						role: 'donor',
						login_mode: 'facebook',
						bio: '',
						image_id: null,
					},
					'email',
				);

				req.session.user = newUser;

				return res.status(200).send({
					url: '/profile',
				});
			} catch (error) {
				return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
			}
		}

		return this.handleError(res, 'Error during login!\nTry again in a few minutes!');
	}
}
