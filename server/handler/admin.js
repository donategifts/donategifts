const DonationRepository = require('../db/repository/DonationRepository');
const UserRepository = require('../db/repository/UserRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');
const BaseHandler = require('./basehandler');

module.exports = class AdminHandler extends BaseHandler {
	#wishCardRepository;

	#donationsRepository;

	#userRepository;

	constructor() {
		super();

		this.#wishCardRepository = new WishCardRepository();
		this.#donationsRepository = new DonationRepository();
		this.#userRepository = new UserRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePutIndex = this.handlePutIndex.bind(this);
		this.handleGetWishCard = this.handleGetWishCard.bind(this);
	}

	async handleGetIndex(_req, res, _next) {
		try {
			if (res.locals.user.userRole !== 'admin') {
				return res.status(404).render('404');
			}

			const wishcards = await this.#wishCardRepository.getWishCardsByStatus('draft');
			const wishCardsWithAgencyDetails = [];

			for (let i = 0; i < wishcards.length; i++) {
				const wishCard = wishcards[i];
				const agencyDetails = wishCard.belongsTo;
				const agencySimple = {
					agencyName: agencyDetails.agencyName,
					agencyPhone: agencyDetails.agencyPhone,
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
			const { wishCardId, wishItemURL } = req.body;

			const wishCardModifiedFields = {
				wishItemURL,
				status: 'published',
			};

			await this.#wishCardRepository.updateWishCard(wishCardId, wishCardModifiedFields);

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

		const donation = await this.#donationsRepository.getDonationByWishCardId(wishCardId);

		if (!donation) {
			return this.handleError({ res, code: 400, error: 'Donation not found' });
		}

		const accountManager = await this.#userRepository.getUserByObjectId(
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
};
