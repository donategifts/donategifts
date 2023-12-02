import { Request, Response, NextFunction } from 'express';

import AgencyRepository from '../../db/repository/AgencyRepository';
import MessageRepository from '../../db/repository/MessageRepository';
import UserRepository from '../../db/repository/UserRepository';
import WishCardRepository from '../../db/repository/WishCardRepository';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';
import Utils from '../../helper/utils';

import BaseApiController from './basecontroller';

export default class WishCardApiController extends BaseApiController {
	private wishCardRepository: WishCardRepository;
	private agencyRepository: AgencyRepository;
	private messageRepository: MessageRepository;
	private userRepository: UserRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		this.agencyRepository = new AgencyRepository();
		this.messageRepository = new MessageRepository();
		this.userRepository = new UserRepository();

		this.getAgencyWishcards = this.getAgencyWishcards.bind(this);
		this.putAgencyWishCardById = this.putAgencyWishCardById.bind(this);
		this.postWishCardAsDraft = this.postWishCardAsDraft.bind(this);
		this.postMessage = this.postMessage.bind(this);
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

			const { childImage, wishItemImage } = req.files;

			const productID = Utils.extractProductIDFromLink(wishItemURL);

			const userAgency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);

			const newWishCard = await this.wishCardRepository.createNewWishCard({
				childFirstName,
				childInterest,
				childBirthYear,
				childImage: config.AWS.USE
					? req.files?.childImage[0].Location
					: `/uploads/${childImage[0].filename}`,
				childStory,
				wishItemName,
				wishItemPrice,
				wishItemInfo,
				wishItemURL,
				wishItemImage: config.AWS.USE
					? req.files?.wishItemImage[0].Location
					: `/uploads/${wishItemImage[0].filename}`,
				productID,
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

			return this.sendResponse(res, newWishCard);
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async postMessage(req: Request, res: Response, _next: NextFunction) {
		try {
			const { messageFrom, messageTo, message } = req.body;
			const newMessage = await this.messageRepository.createNewMessage({
				messageFrom,
				messageTo,
				message,
			});

			const wishCard = await this.wishCardRepository.getWishCardById(messageTo);
			const donor = await this.userRepository.getUserByObjectId(messageFrom);

			if (wishCard && donor) {
				const agencyManager = await this.userRepository.getUserByObjectId(
					wishCard?.createdBy,
				);

				try {
					this.log.info('Sending agency message alert.');
					await Messaging.sendAgencyMessageAlert({
						agencyEmail: agencyManager?.email,
						childName: wishCard?.childFirstName,
						message,
						donorFirstName: donor?.email,
					});
				} catch (error) {
					this.log.error(error);
				}
			}

			return this.sendResponse(res, newMessage);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
