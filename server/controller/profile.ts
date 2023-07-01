import Agency from '../db/models/Agency';
import WishCard from '../db/models/WishCard';
import AgencyRepository from '../db/repository/AgencyRepository';
import DonationRepository from '../db/repository/DonationRepository';
import UserRepository from '../db/repository/UserRepository';
import WishCardRepository from '../db/repository/WishCardRepository';

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
	}

	async handleGetIndex(_req, res, _next) {
		try {
			const { user } = res.locals;
			if (user.userRole === 'partner') {
				const agency = await this.agencyRepository.getAgencyByUserId(user._id);

				// If user hadn't filled out agency info, redirect them to form
				if (!agency) {
					return this.renderView(res, 'agency');
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

				this.renderView(res, 'profile', {
					agency,
					wishCardsLength,
					draftWishcards,
					activeWishcards,
					inactiveWishcards,
				});
			} else {
				this.renderView(res, 'profile');
			}
		} catch (error) {
			return this.handleError({ res, code: 400, error });
		}
	}

	async handlePutIndex(req, res, _next) {
		try {
			const { aboutMe } = req.body;

			if (!res.locals.user) {
				return this.handleError({ res, code: 403, error: 'No user id in request' });
			}

			const user = await this.userRepository.getUserByObjectId(res.locals.user._id);

			if (!user) {
				return this.handleError({ res, code: 404, error: 'User could not be found' });
			}

			await this.userRepository.updateUserById(user._id.toString(), { aboutMe });

			res.status(200).send({
				success: true,
				error: null,
				data: aboutMe,
			});
		} catch (err) {
			return this.handleError({ res, code: 400, error: err });
		}
	}

	async handlePostImage(req, res, _next) {
		if (req.file === undefined) {
			return this.handleError({
				res,
				code: 400,
				error: 'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			});
		}

		try {
			let filePath;

			if (process.env.NODE_ENV === 'development') {
				// locally when using multer images are saved inside this folder
				filePath = `/uploads/${req.file.filename}`;
			}
			const profileImage = process.env.USE_AWS === 'true' ? req.file.Location : filePath;
			await this.userRepository.updateUserById(res.locals.user._id, { profileImage });

			this.log.info({
				msg: 'Profile picture updated',
				type: 'user_profile_picture_update',
				user: res.locals.user._id,
			});

			res.status(200).send({
				success: true,
				data: profileImage,
			});
		} catch (error) {
			return this.handleError({ res, code: 400, error });
		}
	}

	async handleDeleteImage(_req, res, _next) {
		try {
			// if users had deleted picture replace it with string for the default avatar
			const defaultImage = '/svg/default_profile_avatar.svg';
			await this.userRepository.updateUserById(res.locals.user._id, {
				profileImage: defaultImage,
			});

			res.status(200).send({
				success: true,
				data: defaultImage,
			});

			this.log.info({
				msg: 'Profile picture deleted',
				type: 'user_profile_picture_delete',
				user: res.locals.user._id,
			});
		} catch (error) {
			this.handleError({ res, code: 400, error });
		}
	}

	async handleGetDonations(_req, res, _next) {
		try {
			const { user } = res.locals;

			let donations;

			if (user.userRole === 'partner') {
				const agency = await this.agencyRepository.getAgencyByUserId(user._id);
				donations = await this.donationRepository.getDonationsByAgency(agency!._id);
			} else {
				donations = await this.donationRepository.getDonationsByUser(user._id);
			}

			this.renderView(res, 'donationHistory', { donations });
		} catch (error) {
			this.handleError({ res, code: 400, error });
		}
	}

	async handleGetVerify(req, res, _next) {
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
						return res.status(200).render('profile', {
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

				return this.renderView(res, 'profile', {
					user,
					agency,
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

			return this.handleError({ res, code: 400, error: 'Email Verification failed!' });
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
}
