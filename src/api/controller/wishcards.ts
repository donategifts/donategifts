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

			await this.wishCardRepository.updateWishCardByObjectId(wishCardId, {
				childFirstName,
				childLastName,
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			});

			return this.sendResponse(res, {
				wishCardId,
				childFirstName,
				childLastName,
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	// async postAgencyWishCard(req: Request, res: Response, _next: NextFunction) {
	// 	try {
	// 		const {
	// 			childFirstName,
	// 			childLastName,
	// 			wishItemName,
	// 			wishItemPrice,
	// 			childInterest,
	// 			childStory,
	// 		} = req.body;

	// 		const { childBirthday, wishItemPrice, wishItemURL } = req.body;
	// 		const productID = Utils.extractProductIDFromLink(wishItemURL);
	// 		const filePath =
	// 			config.NODE_ENV === 'development' ? `/uploads/${req.file.filename}` : '';

	// 		const userAgency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);

	// 		const newWishCard = await this.wishCardRepository.createNewWishCard({
	// 			childBirthday: new Date(childBirthday),
	// 			wishItemPrice: Number(wishItemPrice),
	// 			productID,
	// 			wishCardImage: config.AWS.USE ? req.file.Location : filePath,
	// 			createdBy: res.locals.user._id,
	// 			belongsTo: userAgency?._id,
	// 			address: {
	// 				address1: req.body.address1,
	// 				address2: req.body.address2,
	// 				city: req.body.address_city,
	// 				state: req.body.address_state,
	// 				zip: req.body.address_zip,
	// 				country: req.body.address_country,
	// 			},
	// 			...req.body,
	// 		});

	// 		this.log.info({
	// 			msg: 'Wishcard created',
	// 			agency: userAgency?._id,
	// 			wishCardId: newWishCard._id,
	// 		});

	// 		return res.status(200).send({ success: true, url: '/wishcards/manage' });
	// 	} catch (error) {
	// 		return this.handleError(res, error);
	// 	}
	// }
}
