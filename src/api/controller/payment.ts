import { Request, Response, NextFunction } from 'express';

import WishCardRepository from '../../db/repository/WishCardRepository';

import BaseController from './basecontroller';

export default class PaymentController extends BaseController {
	private wishCardRepository: WishCardRepository;
	// private userRepository: UserRepository;
	// private donationRepository: DonationRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		// this.userRepository = new UserRepository();
		// this.donationRepository = new DonationRepository();

		this.handleGetPaymentSuccess = this.handleGetPaymentSuccess.bind(this);
	}

	async handleGetPaymentSuccess(req: Request, res: Response, _next: NextFunction) {
		try {
			// extracting params this way because req.params is returning nothing
			const paramIndex = req.rawHeaders.findIndex((element) =>
				element.includes('/payment/success/'),
			);

			let id = '';
			let amount = '';

			if (paramIndex) {
				const url = req.rawHeaders[paramIndex];
				const idRegex = /\/payment\/success\/([^&]+)/;
				const idMatch = url.match(idRegex);
				const amountRegex = /\$(\d+\.\d+)/;
				const amountMatch = url.match(amountRegex);

				id = idMatch ? idMatch[1] : '';
				amount = amountMatch ? amountMatch[1] : '';
			}

			const wishCard = await this.wishCardRepository.getWishCardByObjectId(id);

			const suggestedCards = await this.wishCardRepository.getRandom('published', 3);

			if (!wishCard) {
				return this.handleError(res, 'Wish card could not be found.');
			}

			const data = {
				email: res.locals.user.email,
				amount,
				wishCard,
				suggestedCards,
			};

			return this.sendResponse(res, data);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
