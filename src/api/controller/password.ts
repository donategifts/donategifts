import { Request, Response, NextFunction } from 'express';
import { Kysely } from 'kysely';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

import UsersRepository from '../../db/repository/postgres/UsersRepository';
import VerificationTokensRepository from '../../db/repository/postgres/VerificationTokensRepository';
import { DB } from '../../db/types/generated/database';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';
import Utils from '../../helper/utils';

import BaseController from './basecontroller';

export default class PasswordController extends BaseController {
	private readonly usersRepository: UsersRepository;
	private readonly verificationTokensRepository: VerificationTokensRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.usersRepository = new UsersRepository(database);
		this.verificationTokensRepository = new VerificationTokensRepository(database);

		this.handlePostNew = this.handlePostNew.bind(this);
		this.handlePostReset = this.handlePostReset.bind(this);
	}

	async handlePostNew(req: Request, res: Response, _next: NextFunction) {
		try {
			const tokenData = await this.usersRepository.getByPasswordResetToken(req.body.token);

			if (moment(tokenData.expires_at) > moment()) {
				const newPassword = await Utils.hashPassword(req.body.password);

				await this.usersRepository.update(tokenData.user_id, {
					password: newPassword,
				});

				return req.session.destroy(() => {
					res.clearCookie(config.SESSION.NAME);
					return this.sendResponse(res, { url: '/login' });
				});
			}

			return this.handleError(res, 'Password token expired');
		} catch (error) {
			this.log.error('[PasswordController] handlePostNew', error);
			return this.handleError(res, error);
		}
	}

	async handlePostReset(req: Request, res: Response, _next: NextFunction) {
		try {
			const user = await this.usersRepository.getByEmail(req.body.email);

			if (!user) {
				return this.handleError(res, 'User not found');
			}

			const token = await this.verificationTokensRepository.create({
				token: uuidv4(),
				type: 'email',
				user_id: user.id,
				expires_at: moment().add(1, 'hours').toDate(),
			});

			await Messaging.sendPasswordResetMail(user.email, token);

			return this.sendResponse(res, {});
		} catch (error) {
			this.log.error('[PasswordController] handlePostReset', error);
			return this.handleError(res, error);
		}
	}
}
