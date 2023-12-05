import { NextFunction, Request, Response } from 'express';

import DonationRepository from '../../db/repository/DonationRepository';
import UserRepository from '../../db/repository/UserRepository';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private userRepository: UserRepository;
	private donationRepository: DonationRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();
		this.donationRepository = new DonationRepository();
	}

	private async sendEmail(email: string, verificationHash: string) {
		const emailResponse = await Messaging.sendVerificationEmail(email, verificationHash);
		const response = emailResponse ? emailResponse.data : '';
		if (config.NODE_ENV === 'development') {
			this.log.info(response);
		}
	}

	async handlePostResendVerificationLink(req: Request, res: Response, _next: NextFunction) {
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

	async handleGetDonations(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;

			const donations = await this.donationRepository.getDonationsByUser(user._id);
			if (!donations) {
				return this.handleError(res, 'Donation data could not be found');
			}

			return this.sendResponse(res, donations);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
