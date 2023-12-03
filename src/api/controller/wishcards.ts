import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import AgencyRepository from '../../db/repository/AgencyRepository';
import DonationRepository from '../../db/repository/DonationRepository';
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
	private donationRepository: DonationRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		this.agencyRepository = new AgencyRepository();
		this.messageRepository = new MessageRepository();
		this.userRepository = new UserRepository();
		this.donationRepository = new DonationRepository();

		this.getAgencyWishcards = this.getAgencyWishcards.bind(this);
		this.putAgencyWishCardById = this.putAgencyWishCardById.bind(this);
		this.postWishCardAsDraft = this.postWishCardAsDraft.bind(this);
		this.postMessage = this.postMessage.bind(this);
		this.getWishCardSingle = this.getWishCardSingle.bind(this);
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

	async getWishCardSingle(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			let donationFrom;
			if (res.locals.user && wishcard?.status == 'donated') {
				const donation = await this.donationRepository.getDonationByWishCardId(
					String(wishcard._id),
				);
				if (donation?.donationFrom._id.toString() == String(res.locals.user._id)) {
					donationFrom = donation?.donationFrom._id.toString();
				}
			}

			const agency = wishcard!.belongsTo;

			agency.agencyWebsite = Utils.ensureProtocol(agency.agencyWebsite);

			const messages = await this.messageRepository.getMessagesByWishCardId(wishcard!._id);

			const birthday = wishcard?.childBirthYear
				? moment(new Date(wishcard.childBirthYear))
				: wishcard?.childBirthday
				? moment(new Date(wishcard.childBirthday))
				: undefined;

			const age = birthday?.isValid()
				? moment(new Date()).diff(birthday, 'years')
				: 'Not Provided';

			let defaultMessages;
			if (res.locals.user) {
				defaultMessages = Utils.getMessageChoices(
					res.locals.user.fName,
					wishcard!.childFirstName,
				);
			}
			if (donationFrom && defaultMessages) {
				defaultMessages.unshift(`Custom Message`);
			}

			return this.sendResponse(res, {
				wishcard: {
					...wishcard,
					age,
				},
				agency: agency || {},
				donationFrom: donationFrom || null,
				messages,
				defaultMessages: defaultMessages || [],
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
