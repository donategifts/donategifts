import { NextFunction, Request, Response } from 'express';

import DonationRepository from '../db/repository/DonationRepository';
import UserRepository from '../db/repository/UserRepository';
import WishCardRepository from '../db/repository/WishCardRepository';

import BaseController from './basecontroller';

export default class AdminController extends BaseController {
	private wishCardRepository: WishCardRepository;

	private donationsRepository: DonationRepository;

	private userRepository: UserRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		this.donationsRepository = new DonationRepository();
		this.userRepository = new UserRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePutIndex = this.handlePutIndex.bind(this);
		this.handleGetWishCard = this.handleGetWishCard.bind(this);
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcards = await this.wishCardRepository.getWishCardsByStatus('draft');
			const wishCardsWithAgencyDetails: any[] = [];

			for (const wishCard of wishcards) {
				const agencySimple = {
					agencyName: wishCard.belongsTo.agencyName,
					agencyPhone: wishCard.belongsTo.agencyPhone,
				};

				const mergedObj = { ...wishCard, ...agencySimple };

				wishCardsWithAgencyDetails.push(mergedObj);
			}

			this.renderView(res, 'admin/wishcards', { wishCardsWithAgencyDetails });
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handlePutIndex(req: Request, res: Response, _next: NextFunction) {
		try {
			const { wishCardId, wishItemUrl } = req.body;

			const wishCardModifiedFields = {
				wishItemUrl,
				status: 'published',
			};

			await this.wishCardRepository.updateWishCardByObjectId(
				wishCardId,
				wishCardModifiedFields,
			);

			// @TODO: add agency notification email sending here after status was updated
			return res.status(200).send({
				success: true,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetWishCard(req: Request, res: Response, _next: NextFunction) {
		const { wishCardId } = req.params;

		const donation = await this.donationsRepository.getDonationByWishCardId(wishCardId);

		if (!donation) {
			return this.handleError(res, 'Donation not found');
		}

		const accountManager = await this.userRepository.getUserByObjectId(
			donation.donationTo.accountManager,
		);

		if (!accountManager) {
			return this.handleError(res, 'AccountManager not found');
		}

		this.renderView(res, 'admin/donationdetails', {
			wishCard: donation.donationCard,
			agency: donation.donationTo,
			donation,
			donor: donation.donationFrom,
			accountManager,
		});
	}
}
