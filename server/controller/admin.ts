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

	async handleGetIndex(_req, res, _next) {
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

			this.renderView(res, 'adminWishCards', { wishCardsWithAgencyDetails });
		} catch (error) {
			this.handleError({ res, code: 400, error });
		}
	}

	async handlePutIndex(req, res, _next) {
		try {
			const { wishCardId, wishItemUrl } = req.body;

			const wishCardModifiedFields = {
				wishItemUrl,
				status: 'published',
			};

			await this.wishCardRepository.updateWishCard(wishCardId, wishCardModifiedFields);

			// @TODO: add agency notification email sending here after status was updated
			return res.status(200).send({
				success: true,
			});
		} catch (error) {
			this.handleError({ res, code: 400, error });
		}
	}

	async handleGetWishCard(req, res, _next) {
		const { wishCardId } = req.params;

		const donation = await this.donationsRepository.getDonationByWishCardId(wishCardId);

		if (!donation) {
			return this.handleError({ res, code: 400, error: 'Donation not found' });
		}

		const accountManager = await this.userRepository.getUserByObjectId(
			donation.donationTo.accountManager,
		);

		if (!accountManager) {
			return this.handleError({ res, code: 400, error: 'AccountManager not found' });
		}

		this.renderView(res, 'adminDonationDetails', {
			wishCard: donation.donationCard,
			agency: donation.donationTo,
			donation,
			donor: donation.donationFrom,
			accountManager,
		});
	}
}
