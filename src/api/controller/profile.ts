import { NextFunction, Request, Response } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import DonationRepository from '../../db/repository/DonationRepository';
import UserRepository from '../../db/repository/UserRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private userRepository: UserRepository;
	private donationRepository: DonationRepository;
	private agencyRepository: AgencyRepository;
	private wishcardRepository: WishCardRepository;

	constructor() {
		super();

		this.userRepository = new UserRepository();
		this.donationRepository = new DonationRepository();
		this.agencyRepository = new AgencyRepository();
		this.wishcardRepository = new WishCardRepository();
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

	async handleGetAgency(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;
			if (user?.userRole === 'partner') {
				const agency = await this.agencyRepository.getAgencyByUserId(user._id);

				// If user hadn't filled out agency info, redirect them to form
				if (!agency) {
					return this.handleError(res, 'signup/agencydata');
				}

				const wishCards = await this.wishcardRepository.getWishCardByAgencyId(agency?._id);
				const wishCardsLength = wishCards.length;

				return this.sendResponse(res, { ...agency, wishCardsLength });
			}
			return this.handleError(res, 'Unauthorized: Not an agency user');
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePutAccount(req: Request, res: Response, _next: NextFunction) {
		try {
			const { fName, lName, aboutMe } = req.body;

			if (!res.locals.user) {
				return this.handleError(res, 'Unauthorized action: No user in request');
			}

			const user = await this.userRepository.getUserByObjectId(res.locals.user._id);

			if (!user) {
				return this.handleError(res, 'Error: User could not be found');
			}

			const updateProps = {
				...(fName != null && { fName }),
				...(lName != null && { lName }),
				...(aboutMe != null && { aboutMe }),
			};

			const updatedUser = await this.userRepository.getUserAndUpdateById(
				user._id.toString(),
				updateProps,
			);
			// include eslint line disable because of the false positive error
			// Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
			if (updatedUser) {
				req.session.user = updatedUser; // eslint-disable-line require-atomic-updates
			}

			return this.sendResponse(res, 'Acount details updated');
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetAccount(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;
			const foundUser = await this.userRepository.getUserByObjectId(user._id);
			if (!foundUser) {
				return this.handleError(res, 'Error: User not found');
			}
			return this.sendResponse(res, foundUser);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
