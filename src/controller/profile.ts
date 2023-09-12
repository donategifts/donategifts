import { NextFunction, Request, Response } from 'express';

import Agency from '../db/models/Agency';
import WishCard from '../db/models/WishCard';
import AgencyRepository from '../db/repository/AgencyRepository';
import DonationRepository from '../db/repository/DonationRepository';
import UserRepository from '../db/repository/UserRepository';
import WishCardRepository from '../db/repository/WishCardRepository';
import config from '../helper/config';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private agencyRepository: AgencyRepository;

	private wishCardRepository: WishCardRepository;

	private userRepository: UserRepository;

	private donationRepository: DonationRepository;

	constructor() {
		super();

		this.agencyRepository = new AgencyRepository();
		this.wishCardRepository = new WishCardRepository();
		this.userRepository = new UserRepository();
		this.donationRepository = new DonationRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePutIndex = this.handlePutIndex.bind(this);
		this.handlePostImage = this.handlePostImage.bind(this);
		this.handleDeleteImage = this.handleDeleteImage.bind(this);
		this.handleGetDonations = this.handleGetDonations.bind(this);
		this.handleGetVerify = this.handleGetVerify.bind(this);
		this.handlePutAccount = this.handlePutAccount.bind(this);
		this.handlePutAgency = this.handlePutAgency.bind(this);
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;
			if (user?.userRole === 'partner') {
				const agency = await this.agencyRepository.getAgencyByUserId(user._id);

				// If user hadn't filled out agency info, redirect them to form
				if (!agency) {
					return this.renderView(res, 'signup/agencydata');
				}

				const wishCards = await this.wishCardRepository.getWishCardByAgencyId(agency._id);
				const wishCardsLength = wishCards.length;
				const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
				const activeWishcards = wishCards.filter(
					(wishcard) => wishcard.status === 'published',
				);
				const inactiveWishcards = wishCards.filter(
					(wishcard) => wishcard.status === 'donated',
				);

				this.renderView(res, 'profile/overview', {
					agency,
					wishCardsLength,
					draftWishcards,
					activeWishcards,
					inactiveWishcards,
				});
			} else {
				this.renderView(res, 'profile/overview');
			}
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePutIndex(req: Request, res: Response, _next: NextFunction) {
		try {
			const { aboutMe } = req.body;

			const user = await this.userRepository.getUserByObjectId(res.locals.user._id);

			if (!user) {
				return this.handleError(res, 'User could not be found');
			}

			const updatedUser = await this.userRepository.getUserAndUpdateById(
				user._id.toString(),
				{
					aboutMe,
				},
			);
			// include eslint line disable because of the false positive error
			// Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
			if (updatedUser) {
				req.session.user = updatedUser; // eslint-disable-line require-atomic-updates
			}

			return res.status(200).send({
				success: true,
				error: null,
				data: aboutMe,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePostImage(req: Request, res: Response, _next: NextFunction) {
		if (!req.file) {
			return this.handleError(
				res,
				'File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			);
		}

		try {
			let filePath;

			if (config.NODE_ENV === 'development') {
				// locally when using multer images are saved inside this folder
				filePath = `/uploads/${req.file.filename}`;
			}
			const profileImage = config.AWS.USE ? req.file.location : filePath;
			await this.userRepository.updateUserById(res.locals.user._id, { profileImage });

			this.log.info({
				msg: 'Profile picture updated',
				type: 'user_profile_picture_update',
				user: res.locals.user._id,
			});

			return res.status(200).send({
				success: true,
				data: profileImage,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleDeleteImage(_req: Request, res: Response, _next: NextFunction) {
		try {
			// if users had deleted picture replace it with string for the default avatar
			const defaultImage = '/svg/default_profile_avatar.svg';
			await this.userRepository.updateUserById(res.locals.user._id, {
				profileImage: defaultImage,
			});

			this.log.info({
				msg: 'Profile picture deleted',
				type: 'user_profile_picture_delete',
				user: res.locals.user._id,
			});

			return res.status(200).send({
				success: true,
				data: defaultImage,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetDonations(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;

			let donations;

			if (user.userRole === 'partner') {
				const agency = await this.agencyRepository.getAgencyByUserId(user._id);
				donations = await this.donationRepository.getDonationsByAgency(agency!._id);
			} else {
				donations = await this.donationRepository.getDonationsByUser(user._id);
			}

			this.renderView(res, 'profile/history', { donations });
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleGetVerify(req: Request, res: Response, _next: NextFunction) {
		try {
			let user = await this.userRepository.getUserByVerificationHash(req.params.hash);

			if (user) {
				let agency = {} as Agency;
				let wishCards: WishCard[] = [];
				let wishCardsLength = 0;
				let draftWishcards: WishCard[] = [];
				let activeWishcards: WishCard[] = [];
				let inactiveWishcards: WishCard[] = [];

				if (user.userRole === 'partner') {
					agency = <Agency>(
						await this.agencyRepository.getAgencyByUserId(user._id.toString())
					);
					wishCards = <WishCard[]>(
						await this.wishCardRepository.getWishCardByAgencyId(agency._id)
					);
					wishCardsLength = wishCards.length;
					draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');

					activeWishcards = wishCards.filter(
						(wishcard) => wishcard.status === 'published',
					);

					inactiveWishcards = wishCards.filter(
						(wishcard) => wishcard.status === 'donated',
					);
				}

				if (user.emailVerified) {
					if (res.locals.user) {
						return res.status(200).render('profile/overview', {
							user: res.locals.user,
							agency,
							wishCards,
							wishCardsLength,
							draftWishcards,
							activeWishcards,
							inactiveWishcards,
						});
					}
					return this.renderView(res, 'login', {
						successNotification: {
							msg: 'Your email is already verified.',
						},
						errorNotification: null,
					});
				}

				await this.userRepository.setUserEmailVerification(user._id.toString(), true);
				user = await this.userRepository.getUserByObjectId(user._id.toString());

				return this.renderView(res, 'profile/overview', {
					user,
					wishCards,
					wishCardsLength,
					draftWishcards,
					activeWishcards,
					inactiveWishcards,
					successNotification: {
						msg: 'Email Verification successful',
					},
				});
			}

			return this.handleError(res, 'Email Verification failed!');
		} catch (error) {
			this.log.error(error);
			return this.renderView(
				res,
				'login',
				{
					errorNotification: { msg: 'Email Verification failed' },
				},
				400,
			);
		}
	}

	async handlePutAccount(req: Request, res: Response, _next: NextFunction) {
		try {
			const { fName, lName } = req.body;

			if (!res.locals.user) {
				return this.handleError(res, 'No user id in request', 403);
			}

			const user = await this.userRepository.getUserByObjectId(res.locals.user._id);

			if (!user) {
				return this.handleError(res, 'User could not be found', 404);
			}

			const updatedUser = await this.userRepository.getUserAndUpdateById(
				user._id.toString(),
				{
					fName,
					lName,
				},
			);
			// include eslint line disable because of the false positive error
			// Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
			if (updatedUser) {
				req.session.user = updatedUser; // eslint-disable-line require-atomic-updates
			}

			return res.status(200).send({
				success: true,
				error: null,
				data: { fName, lName },
			});
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
				return this.handleError(res, 'Agency could not be found', 404);
			}

			await this.agencyRepository.updateAgency(res.locals.user._id, {
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

			return res.status(200).send({
				success: true,
				error: null,
				data: {
					agencyBio,
					agencyPhone,
					agencyWebsite,
					address1,
					address2,
					city,
					state,
					country,
					zipcode,
				},
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
