import { NextFunction, Request, Response } from 'express';

import UserRepository from '../../db/repository/UserRepository';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private userRepository: UserRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();

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

			const user = await this.userRepository.getUserByObjectId(userId);

			if (!user) {
				return this.handleError(res, 'User not found');
			}

			if (user.emailVerified) {
				return this.handleError(res, 'User is already verified');
			}

			await this.sendEmail(user.email, user.verificationHash);

			return this.sendResponse(res, 'Verification email sent');
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
