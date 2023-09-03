import { Request, Response, NextFunction } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';

import BaseApiController from './basecontroller';

export default class WishCardApiController extends BaseApiController {
	private wishCardRepository: WishCardRepository;

	private agencyRepository: AgencyRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		this.agencyRepository = new AgencyRepository();

		this.getAgencyWishcards = this.getAgencyWishcards.bind(this);
		this.putAgencyWishCardById = this.putAgencyWishCardById.bind(this);
	}

	async getAgencyWishcards(_req: Request, res: Response, _next: NextFunction) {
		try {
			const userAgency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);
			const wishCards = await this.wishCardRepository.getWishCardByAgencyId(userAgency!._id);

			const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
			const activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
			const inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');

			return this.sendResponse(res, {
				draftWishcards,
				activeWishcards,
				inactiveWishcards,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async putAgencyWishCardById(req: Request, res: Response, _next: NextFunction) {
		try {
			const {
				wishCardId,
				childFirstName,
				childLastName,
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			} = req.body;

			const updateParams = {
				childFirstName,
				childLastName,
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			};

			await this.wishCardRepository.updateWishCardByObjectId(wishCardId, updateParams);

			return this.sendResponse(res, updateParams);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
