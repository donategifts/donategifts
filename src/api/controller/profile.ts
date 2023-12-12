import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import DonationRepository from '../../db/repository/DonationRepository';
import UserRepository from '../../db/repository/UserRepository';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private userRepository: UserRepository;
	private donationRepository: DonationRepository;
	private agencyRepository: AgencyRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();
		this.donationRepository = new DonationRepository();
		this.agencyRepository = new AgencyRepository();
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

	async handlePutAgency(req: Request, res: Response, _next: NextFunction) {
		try {
			const {
				agencyBio,
				agencyPhone,
				agencyWebsite,
				address1,
				address2,
				city,
				state,
				country,
				zipcode,
			} = req.body;

			const agency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);

			if (!agency) {
				this.log.info('Agency not found');
				return this.handleError(res, 'Agency could not be found');
			}

			const result = await this.agencyRepository.updateAgency(res.locals.user._id, {
				agencyBio,
				agencyPhone,
				agencyWebsite,
				agencyAddress: {
					address1,
					address2,
					city,
					state,
					country,
					zipcode,
				},
			});

			if (result.acknowledged) {
				this.log.info('Agency Updated');
				return this.sendResponse(res, { message: 'Agency updated' });
			} else {
				this.log.info('Failed to update agency');
				return this.handleError(res, 'Failed to update agency information');
			}
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
