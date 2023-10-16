import { NextFunction, Request, Response } from 'express';
import { Kysely } from 'kysely';

import UsersRepository from '../../db/repository/postgres/UsersRepository';
import VerificationTokensRepository from '../../db/repository/postgres/VerificationTokensRepository';
import { DB } from '../../db/types/generated/database';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private usersRepository: UsersRepository;
	private verificationTokensRepository: VerificationTokensRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.usersRepository = new UsersRepository(database);
		this.verificationTokensRepository = new VerificationTokensRepository(database);

		this.postResendVerificationLink = this.postResendVerificationLink.bind(this);
	}

	private async sendEmail(email: string, verificationHash: string) {
		const emailResponse = await Messaging.sendVerificationEmail(email, verificationHash);
		const response = emailResponse ? emailResponse.data : '';
		if (config.NODE_ENV === 'development') {
			this.log.info(response);
		}
	}

	async postResendVerificationLink(req: Request, res: Response, _next: NextFunction) {
		try {
			const { userId } = req.body;

			const user = await this.usersRepository.getById(userId);

			if (!user) {
				return this.handleError(res, 'User not found');
			}

			if (user.is_verified) {
				return this.handleError(res, 'User is already verified');
			}

			const { token } = await this.verificationTokensRepository.getByUserId(userId);

			await this.sendEmail(user.email, token);

			return this.sendResponse(res, 'Verification email sent');
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
