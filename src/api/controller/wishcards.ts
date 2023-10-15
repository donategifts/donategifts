import { NextFunction, Request, Response } from 'express';
import moment from 'moment';

import AgencyRepository from '../../db/repository/AgencyRepository';
import MessageRepository from '../../db/repository/MessageRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import config from '../../helper/config';
import Utils from '../../helper/utils';

import BaseApiController from './basecontroller';

export default class WishCardApiController extends BaseApiController {
	private wishCardRepository: WishCardRepository;

	private agencyRepository: AgencyRepository;

	private messageRepository: WishCardRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		this.agencyRepository = new AgencyRepository();
		this.messageRepository = new MessageRepository();

		this.getSingleWishcard = this.getSingleWishcard.bind(this);
		this.getAgencyWishcards = this.getAgencyWishcards.bind(this);
		this.putAgencyWishCardById = this.putAgencyWishCardById.bind(this);
		this.postWishCardAsDraft = this.postWishCardAsDraft.bind(this);
	}

	async getSingleWishcard(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			// this agency object is returning undefined and breaking frontend
			const agency = wishcard!.belongsTo;
			const messages = await this.messageRepository.getMessagesByWishCardId(wishcard!._id);
			let defaultMessages;
			if (res.locals.user) {
				defaultMessages = Utils.getMessageChoices(
					res.locals.user.fName,
					wishcard!.childFirstName,
				);
			}

			this.sendResponse(res, {
				wishcard: {
					...wishcard,
					age: wishcard?.childBirthday
						? moment(new Date()).diff(wishcard?.childBirthday, 'years')
						: 'Not Provided',
				},
				agency: agency || {},
				messages,
				defaultMessages: defaultMessages || [],
			});
		} catch (error) {
			this.handleError(res, error);
		}
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
				address,
			} = req.body;

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
					address1: address?.address1,
					address2: address?.address2,
					city: address?.city,
					state: address?.state,
					country: address?.country,
					zipcode: address?.zipcode,
				},
				...req.body,
			});

			return this.sendResponse(res, {
				message: `New wishcard was created: ${newWishCard._id}`,
				card: newWishCard,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
