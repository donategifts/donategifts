import { NextFunction, Request, Response } from 'express';
import { Kysely, Selectable } from 'kysely';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import ImagesRepository from '../../db/repository/postgres/ImagesRepository';
import OrdersRepository from '../../db/repository/postgres/OrdersRepository';
import UsersRepository from '../../db/repository/postgres/UsersRepository';
import VerificationTokensRepository from '../../db/repository/postgres/VerificationTokensRepository';
import WishCardsRepository from '../../db/repository/postgres/WishCardsRepository';
import { DB, Orders, Wishcards, Agencies } from '../../db/types/generated/database';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ProfileController extends BaseController {
	private usersRepository: UsersRepository;
	private agenciesRepository: AgenciesRepository;
	private wishcardsRepository: WishCardsRepository;
	private ordersRepository: OrdersRepository;
	private imagesRepository: ImagesRepository;
	private verificationTokensRepository: VerificationTokensRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.usersRepository = new UsersRepository(database);
		this.agenciesRepository = new AgenciesRepository(database);
		this.wishcardsRepository = new WishCardsRepository(database);
		this.ordersRepository = new OrdersRepository(database);
		this.imagesRepository = new ImagesRepository(database);
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

			return this.sendResponse(res, {
				success: true,
				message: 'Verification email sent',
			});
		} catch (error) {
			this.log.error('[ProfileController] postResendVerificationLink: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;
			if (user?.role === 'partner') {
				const agency = await this.agenciesRepository.getByAccountManagerId(user.id);

				// If user hadn't filled out agency info, redirect them to form
				// if (!agency) {
				// 	return this.renderView(res, 'signup/agencydata');
				// }

				const wishCards = await this.wishcardsRepository.getByAgencyId(agency.id);
				const wishCardsLength = wishCards.length;
				const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
				const activeWishcards = wishCards.filter(
					(wishcard) => wishcard.status === 'published',
				);
				const inactiveWishcards = wishCards.filter(
					(wishcard) => wishcard.status === 'donated',
				);

				return this.sendResponse(res, {
					success: true,
					message: null,
					data: {
						agency,
						wishCardsLength,
						draftWishcards,
						activeWishcards,
						inactiveWishcards,
					},
				});
			} else {
				return this.sendResponse(res, { success: false, error: null });
			}
		} catch (error) {
			this.log.error('[ProfileController] handleGetIndex: ', error);
			return this.handleError(res, error);
		}
	}

	async handlePutIndex(req: Request, res: Response, _next: NextFunction) {
		try {
			const { first_name, last_name, bio } = req.body;

			let user = await this.usersRepository.getById(res.locals.user.id);

			if (!user) {
				return this.handleError(res, 'User could not be found');
			}

			const updatedUser = await this.usersRepository.update(user.id, {
				first_name,
				last_name,
				bio,
			});
			// include eslint line disable because of the false positive error
			// Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
			if (updatedUser) {
				req.session.user = updatedUser; // eslint-disable-line require-atomic-updates
			}
			user = updatedUser;

			return this.sendResponse(res, {
				success: true,
				message: null,
				data: user,
			});
		} catch (error) {
			this.log.error('[ProfileController] handlePutIndex: ', error);
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

			if (res.locals.user.image_id) {
				await this.imagesRepository.update(res.locals.user.image_id, { url: profileImage });
			} else {
				const newImage = await this.imagesRepository.create({
					url: profileImage,
					created_by: res.locals.user.id,
				});
				await this.usersRepository.update(res.locals.user.id, { image_id: newImage.id });
			}

			this.log.info({
				msg: 'Profile picture updated',
				type: 'user_profile_picture_update',
				user: res.locals.user.id,
			});

			return this.sendResponse(res, {
				success: true,
				message: null,
				data: profileImage,
			});
		} catch (error) {
			this.log.error('[ProfileController] handlePostImage: ', error);
			return this.handleError(res, error);
		}
	}

	async handleDeleteImage(_req: Request, res: Response, _next: NextFunction) {
		try {
			// if users had deleted picture replace it with string for the default avatar
			//const defaultImage = '/svg/default_profile_avatar.svg';
			//To do: Create a default user who links to the default image
			const defaultUser = await this.usersRepository.getByEmail('');
			//@ts-ignore
			const defaultImage = await this.imagesRepository.getById(defaultUser.image_id);

			await this.usersRepository.update(res.locals.user.id, {
				image_id: defaultImage.id,
			});

			this.log.info({
				msg: 'Profile picture deleted',
				type: 'user_profile_picture_delete',
				user: res.locals.user.id,
			});

			return this.sendResponse(res, {
				success: true,
				message: null,
				data: defaultImage,
			});
		} catch (error) {
			this.log.error('[ProfileController] handleDeleteImage: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetDonations(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;

			let donations: Selectable<Orders>[];

			if (user.role === 'partner') {
				const agency = await this.agenciesRepository.getByAccountManagerId(user.id);
				donations = await this.ordersRepository.getByAgencyId(agency.id);
			} else {
				donations = await this.ordersRepository.getByDonorId(user.id);
			}

			return this.sendResponse(res, {
				success: true,
				message: null,
				data: donations,
			});
		} catch (error) {
			this.log.error('[ProfileController] handleGetDonations: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetVerify(req: Request, res: Response, _next: NextFunction) {
		try {
			const user = await this.usersRepository.getByVerificationToken(req.params.hash);

			if (user) {
				let agency = {} as Selectable<Agencies>;
				let wishCards: Selectable<Wishcards>[] = [];
				let wishCardsLength = 0;
				let draftWishcards: Selectable<Wishcards>[] = [];
				let activeWishcards: Selectable<Wishcards>[] = [];
				let inactiveWishcards: Selectable<Wishcards>[] = [];

				if (user.role === 'partner') {
					agency = await this.agenciesRepository.getByAccountManagerId(user.id);
					wishCards = await this.wishcardsRepository.getByAgencyId(agency.id);
					wishCardsLength = wishCards.length;
					draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
					activeWishcards = wishCards.filter(
						(wishcard) => wishcard.status === 'published',
					);
					inactiveWishcards = wishCards.filter(
						(wishcard) => wishcard.status === 'donated',
					);
				}

				if (user.is_verified) {
					if (res.locals.user) {
						return this.sendResponse(res, {
							success: true,
							message: null,
							data: {
								user: res.locals.user,
								agency,
								wishCards,
								wishCardsLength,
								draftWishcards,
								activeWishcards,
								inactiveWishcards,
							},
						});
					}
					return this.sendResponse(res, {
						success: false,
						message: 'Your email is already verified.',
					});
				}

				await this.usersRepository.updateVerificationStatus(user.id, true);

				return this.sendResponse(res, {
					success: true,
					message: 'Email Verification Successful',
					data: {
						user,
						wishCards,
						wishCardsLength,
						draftWishcards,
						activeWishcards,
						inactiveWishcards,
					},
				});
			}

			return this.handleError(res, 'Email Verification failed!');
		} catch (error) {
			this.log.error('[ProfileController] handleGetVerify: ', error);
			return this.sendResponse(res, {
				success: false,
				message: 'Email Verification failed',
			});
		}
	}

	async handlePutAccount(req: Request, res: Response, _next: NextFunction) {
		try {
			const { fName, lName } = req.body;

			if (!res.locals.user) {
				return this.handleError(res, 'No user id in request', 403);
			}

			const user = await this.usersRepository.getById(res.locals.user.id);

			if (!user) {
				return this.handleError(res, 'User could not be found', 404);
			}

			const updatedUser = await this.usersRepository.update(user.id, {
				first_name: fName,
				last_name: lName,
			});
			// include eslint line disable because of the false positive error
			// Possible race condition: `req.session.user` might be assigned based on an outdated state of `req`
			if (updatedUser) {
				req.session.user = updatedUser; // eslint-disable-line require-atomic-updates
			}

			return res.status(200).send({
				success: true,
				message: null,
				data: { fName, lName },
			});
		} catch (error) {
			this.log.error('[ProfileController] handlePutAccount: ', error);
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

			const agency = await this.agenciesRepository.getByAccountManagerId(res.locals.user.id);

			if (!agency) {
				return this.handleError(res, 'Agency could not be found', 404);
			}

			await this.agenciesRepository.update(agency.id, {
				bio: agencyBio,
				phone: agencyPhone,
				website: agencyWebsite,
				address_line_1: address1,
				address_line_2: address2,
				city,
				state,
				country_code: country,
				zip_code: zipcode,
			});

			return this.sendResponse(res, {
				success: true,
				message: null,
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
			this.log.error('[ProfileController] handlePutAgency: ', error);
			return this.handleError(res, error);
		}
	}
}
