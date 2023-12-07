import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import WishCardRepository from '../../db/repository/WishCardRepository';

import BaseController from './basecontroller';

export default class PaymentController extends BaseController {
	private wishCardRepository: WishCardRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
	}

	async handleGetPaymentSuccess(req: Request, res: Response, _next: NextFunction) {
		try {
			// extracting params this way because req.params is returning nothing
			const paramIndex = req.rawHeaders.findIndex((element) =>
				element.includes('/payment/success/'),
			);

			let id = '';
			let amount = '';
			const currentDate = moment(Date.now());

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
				email: res.locals?.user?.email,
				userId: res.locals?.user?._id,
				amount,
				donationDate: currentDate.format('MMM DD YYYY'),
				wishCardId: wishCard._id,
				wishCard,
				suggestedCards,
			};

			return this.sendResponse(res, data);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
