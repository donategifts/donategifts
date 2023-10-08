import { Request, Response, NextFunction } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import config from '../../helper/config';

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
		this.postWishCardAsDraft = this.postWishCardAsDraft.bind(this);
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
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			} = req.body;

			await this.wishCardRepository.updateWishCardByObjectId(wishCardId, {
				childFirstName,
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			});

			return this.sendResponse(res, {
				wishCardId,
				childFirstName,
				wishItemName,
				wishItemPrice,
				childInterest,
				childStory,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async postWishCardAsDraft(req: Request, res: Response, _next: NextFunction) {
		try {
			const {
				childFirstName,
				childInterest,
				childBirthYear,
				childStory,
				wishItemName,
				wishItemPrice,
				wishItemInfo,
				wishItemURL,
				address1,
				address2,
				city,
				state,
				country,
				zipcode,
			} = req.body;

			console.log('--------------req body: ', req.body);

			const { childImage, wishItemImage } = req.files;

			//TODO: const productID = Utils.extractProductIDFromLink(wishItemURL);

			const userAgency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);

			const newWishCard = await this.wishCardRepository.createNewWishCard({
				childFirstName,
				childInterest,
				childBirthYear,
				childImage: config.AWS.USE
					? req.files?.childImage[0].path
					: `/uploads/${childImage[0].filename}`,
				childStory,
				wishItemName,
				wishItemPrice,
				wishItemInfo,
				wishItemURL,
				wishItemImage: config.AWS.USE
					? req.files?.wishItemImage[0].path
					: `/uploads/${wishItemImage[0].filename}`,
				createdBy: res.locals.user._id,
				belongsTo: userAgency?._id,
				address: {
					address1,
					address2,
					city,
					state,
					country,
					zipcode,
				},
				...req.body,
			});

			return res.status(200).send({
				newWishCard,
				url: '/wishcards/manage', //TODO: this doesn't work
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
