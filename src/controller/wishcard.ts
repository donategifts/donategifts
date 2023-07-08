import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import config from '../../config';
import { MulterRequest } from '../../types/multerrequest';
import WishCard from '../db/models/WishCard';
import AgencyRepository from '../db/repository/AgencyRepository';
import MessageRepository from '../db/repository/MessageRepository';
import UserRepository from '../db/repository/UserRepository';
import WishCardRepository from '../db/repository/WishCardRepository';
import * as DefaultItems from '../helper/defaultItems';
import Utils from '../helper/utils';

import BaseController from './basecontroller';

export default class WishCardController extends BaseController {
	private wishCardRepository: WishCardRepository;

	private agencyRepository: AgencyRepository;

	private userRepository: UserRepository;

	private messageRepository: MessageRepository;

	constructor() {
		super();

		this.wishCardRepository = new WishCardRepository();
		this.agencyRepository = new AgencyRepository();
		this.userRepository = new UserRepository();
		this.messageRepository = new MessageRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostIndex = this.handlePostIndex.bind(this);
		this.handlePostGuided = this.handlePostGuided.bind(this);
		this.handleGetEdit = this.handleGetEdit.bind(this);
		this.handlePostEdit = this.handlePostEdit.bind(this);
		this.handleDeleteSingle = this.handleDeleteSingle.bind(this);
		this.handleGetMe = this.handleGetMe.bind(this);
		this.handleGetCreate = this.handleGetCreate.bind(this);
		this.handlePostSearch = this.handlePostSearch.bind(this);
		this.handleGetSingle = this.handleGetSingle.bind(this);
		this.handleGetDonate = this.handleGetDonate.bind(this);
		this.handleGetRandom = this.handleGetRandom.bind(this);
		this.handlePostMessage = this.handlePostMessage.bind(this);
		this.handleGetDefaults = this.handleGetDefaults.bind(this);
		this.handleGetChoose = this.handleGetChoose.bind(this);
	}

	async getWishCardSearchResult(
		itemName,
		childAge,
		cardIds,
		showDonated = false,
		reverseSort = false,
	) {
		const fuzzySearchResult = await this.wishCardRepository.getWishCardsFuzzy(
			(itemName && itemName.trim()) || '',
			showDonated,
			reverseSort,
			cardIds,
		);

		// remove duplicates
		const allWishCards = fuzzySearchResult.filter(
			(elem, index, self) => index === self.indexOf(elem),
		);

		for (let i = 0; i < allWishCards.length; i++) {
			let childBirthday;

			if (allWishCards[i].childBirthday) {
				childBirthday = allWishCards[i].childBirthday;
			} else {
				childBirthday = new Date();
			}

			const birthday = moment(childBirthday);
			const today = moment(new Date());

			allWishCards[i].age = today.diff(birthday, 'year');
		}

		if (!childAge || childAge === 0) {
			return allWishCards;
		}

		return allWishCards.filter((item) =>
			childAge < 15 ? item.age < childAge : item.age >= childAge,
		);
	}

	async getLockedWishCards(req: Request, _res: Response, _next: NextFunction) {
		const response: {
			userId?: string;
			wishCardId?: string;
			alreadyLockedWishCard?: any;
			error?: string;
		} = {
			wishCardId: req.params.id,
		};

		if (!req.session.user) {
			response.error = 'User not found';
			return response;
		}

		const user = await this.userRepository.getUserByObjectId(req.session.user._id);
		if (!user) {
			response.error = 'User not found';
			return response;
		}
		response.userId = user._id;
		response.alreadyLockedWishCard = await this.wishCardRepository.getLockedWishcardsByUserId(
			req.session.user._id,
		);

		return response;
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcards = await this.wishCardRepository.getAllWishCards();

			const data = [] as unknown as WishCard & { age: number }[];

			for (let i = 0; i < wishcards.length; i++) {
				const birthday = moment(new Date(wishcards[i].childBirthday));
				const today = moment(new Date());

				data.push({ ...wishcards[i], age: today.diff(birthday, 'years') });
			}

			this.renderView(res, 'wishCards', {
				wishcards: data,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handlePostIndex(req: MulterRequest, res: Response, _next: NextFunction) {
		if (!req.file) {
			this.handleError(
				res,
				'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			);
		} else {
			try {
				const { childBirthday, wishItemPrice } = req.body;

				const filePath =
					config.NODE_ENV === 'development' ? `/uploads/${req.file.filename}` : '';

				const userAgency = await this.agencyRepository.getAgencyByUserId(
					res.locals.user._id,
				);

				const newWishCard = await this.wishCardRepository.createNewWishCard({
					childBirthday: new Date(childBirthday),
					wishItemPrice: Number(wishItemPrice),
					wishCardImage: config.AWS.USE ? req.file.Location : filePath,
					createdBy: res.locals.user._id,
					belongsTo: userAgency?._id,
					address: {
						address1: req.body.address1,
						address2: req.body.address2,
						city: req.body.address_city,
						state: req.body.address_state,
						zip: req.body.address_zip,
						country: req.body.address_country,
					},
					...req.body,
				});

				this.log.info({
					msg: 'Wishcard created',
					agency: userAgency?._id,
					wishCardId: newWishCard._id,
				});

				res.status(200).send({ success: true, url: '/wishcards/me' });
			} catch (error) {
				this.handleError(res, error);
			}
		}
	}

	async handlePostGuided(req: MulterRequest, res: Response, _next: NextFunction) {
		if (!req.file) {
			this.handleError(
				res,
				'Error: File must be in jpeg, jpg, gif, or png format. The file mst also be less than 5 megabytes.',
			);
		} else {
			try {
				const {
					childBirthday,
					address1,
					address2,
					address_city,
					address_state,
					address_zip,
					address_country,
				} = req.body;
				let { itemChoice } = req.body;

				let filePath;

				if (config.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}

				itemChoice = JSON.parse(itemChoice);
				const userAgency = await this.agencyRepository.getAgencyByUserId(
					res.locals.user._id,
				);
				const newWishCard = await this.wishCardRepository.createNewWishCard({
					childBirthday: new Date(childBirthday),
					wishItemName: itemChoice.Name,
					wishItemPrice: Number(itemChoice.Price),
					wishItemURL: itemChoice.ItemURL,
					wishCardImage: config.AWS.USE ? req.file.Location : filePath,
					createdBy: res.locals.user._id,
					belongsTo: userAgency?._id,
					address: {
						address1,
						address2,
						city: address_city,
						state: address_state,
						zip: address_zip,
						country: address_country,
					},
					...req.body,
				});

				this.log.info({
					mgs: 'Wishcard created',
					type: 'wishcard_created',
					agency: userAgency?._id,
					wishCardId: newWishCard._id,
				});
				res.status(200).send({ success: true, url: '/wishcards/me' });
			} catch (error) {
				this.handleError(res, error);
			}
		}
	}

	async handleGetEdit(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			if (res.locals.user.userRole !== 'admin') {
				const userAgency = await this.agencyRepository.getAgencyByUserId(
					res.locals.user._id,
				);

				if (wishcard?.belongsTo._id.toString() !== userAgency?._id.toString()) {
					return res.status(403).send({ success: false, url: '/profile' });
				}
			}

			const agency = wishcard!.belongsTo;
			const { agencyAddress } = agency;
			const childBirthday = moment(wishcard?.childBirthday).format('YYYY-MM-DD');

			this.renderView(res, 'wishcardEdit', { wishcard, agencyAddress, childBirthday });
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handlePostEdit(req: Request, res: Response, _next: NextFunction) {
		try {
			const { childBirthday, wishItemPrice } = req.body;
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			await this.wishCardRepository.updateWishCard(wishcard!._id, {
				...req.body,
				childBirthday: childBirthday ? new Date(childBirthday) : wishcard?.childBirthday,
				wishItemPrice: wishItemPrice ? Number(wishItemPrice) : wishcard?.wishItemPrice,
				address: {
					address1: req.body.address1 ? req.body.address1 : wishcard?.address.address1,
					address2: req.body.address2 ? req.body.address2 : wishcard?.address.address2,
					city: req.body.address_city ? req.body.address_city : wishcard?.address.city,
					state: req.body.address_state
						? req.body.address_state
						: wishcard?.address.state,
					zip: req.body.address_zip ? req.body.address_zip : wishcard?.address.zipcode,
					country: req.body.address_country
						? req.body.address_country
						: wishcard?.address.country,
				},
			});

			let url = '/wishcards/me';
			if (res.locals.user.userRole === 'admin') {
				url = '/wishcards/';
			}

			this.log.info({
				mgs: 'Wishcard Updated',
				wishCardId: wishcard?._id,
			});

			res.status(200).send({ success: true, url });
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleDeleteSingle(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);
			const agency = wishcard!.belongsTo;

			let url = '/wishcards/';

			if (res.locals.user.userRole !== 'admin') {
				const userAgency = await this.agencyRepository.getAgencyByUserId(
					res.locals.user._id,
				);
				if (String(agency._id) !== String(userAgency?._id)) {
					return res.status(403).render('403');
				}
				url += 'me';
			}

			await this.wishCardRepository.deleteWishCard(wishcard!._id);

			this.log.info({
				mgs: 'Wishcard Deleted',
				wishCardId: wishcard?._id,
			});
			res.status(200).send({ success: true, url });
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleGetMe(_req: Request, res: Response, _next: NextFunction) {
		try {
			const userAgency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);
			const wishCards = await this.wishCardRepository.getWishCardByAgencyId(userAgency!._id);

			const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
			const activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
			const inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');

			this.renderView(res, 'agencyWishCards', {
				draftWishcards,
				activeWishcards,
				inactiveWishcards,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	handleGetCreate(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'createWishcard');
	}

	async handlePostSearch(req: Request, res: Response, _next: NextFunction) {
		try {
			const { wishitem, showDonatedCheck, younger, older, cardIds, recentlyAdded } = req.body;

			let childAge;
			let showDonated = showDonatedCheck;

			// only true on first visit of page
			if (req.params.init) {
				childAge = 0;
				showDonated = true;
			}

			if (younger) {
				childAge = 14;
			}

			if (older) {
				childAge = 15;
			}

			if (younger && older) {
				childAge = 0;
			}

			const results = await this.getWishCardSearchResult(
				wishitem,
				childAge,
				cardIds || [],
				showDonated,
				recentlyAdded,
			);

			res.status(200).send({
				user: res.locals.user,
				wishcards: results,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleGetSingle(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			// this agency object is returning undefined and breaking frontend
			const agency = wishcard!.belongsTo;
			const messages = await this.messageRepository.getMessagesByWishCardId(wishcard!._id);
			let defaultMessages;
			if (res.locals.user) {
				defaultMessages = Utils.getMessageChoices(
					res.locals.user.fName,
					wishcard?.childFirstName,
				);
			}

			this.renderView(res, 'wishCardFullPage', {
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

	async handleGetDonate(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			const agency = wishcard!.belongsTo;
			const processingFee = 1.08;
			const shipping = 'FREE';
			const tax = 1.0712;

			const totalItemCost = await Utils.calculateWishItemTotalPrice(wishcard!.wishItemPrice);

			const extendedPaymentInfo = {
				processingFee: (
					wishcard!.wishItemPrice * processingFee -
					wishcard!.wishItemPrice
				).toFixed(2),
				shipping,
				tax: (wishcard!.wishItemPrice * tax - wishcard!.wishItemPrice).toFixed(2),
				totalItemCost,
				agency,
			};

			this.renderView(res, 'donate', {
				wishcard: wishcard || [],
				extendedPaymentInfo,
				agency,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleGetRandom(_req: Request, res: Response, _next: NextFunction) {
		try {
			let wishcards = await this.wishCardRepository.getWishCardsByStatus('published');

			if (!wishcards || wishcards.length < 6) {
				const donatedWishCards = await this.wishCardRepository.getWishCardsByStatus(
					'donated',
				);

				wishcards = wishcards.concat(donatedWishCards.slice(0, 6 - wishcards.length));
			} else {
				wishcards.sort(() => Math.random() - 0.5);

				const requiredLength = 3 * Math.ceil(wishcards.length / 3);
				const rem = requiredLength - wishcards.length;

				if (rem !== 0 && wishcards.length > 3) {
					for (let j = 0; j < rem; j++) {
						wishcards.push(wishcards[j]);
					}
				}
			}

			res.render('components/homeSampleCards', { wishcards }, (error, html) => {
				if (error) {
					this.log.error(error);
					res.status(400).json({ success: false, error });
				} else {
					res.status(200).send(html);
				}
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handlePostMessage(req: Request, res: Response, _next: NextFunction) {
		try {
			const { messageFrom, messageTo, message } = req.body;
			const newMessage = await this.messageRepository.createNewMessage({
				messageFrom,
				messageTo,
				message,
			});

			res.status(200).send({
				data: newMessage,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handleGetDefaults(req: Request, res: Response, _next: NextFunction) {
		const ageCategory = Number(req.params.id);
		let itemChoices;

		switch (ageCategory) {
			case 1:
				itemChoices = DefaultItems.babies;
				break;
			case 2:
				itemChoices = DefaultItems.preschoolers;
				break;
			case 3:
				itemChoices = DefaultItems.kids6_8;
				break;
			case 4:
				itemChoices = DefaultItems.kids9_11;
				break;
			case 5:
				itemChoices = DefaultItems.teens;
				break;
			case 6:
				itemChoices = DefaultItems.youth;
				break;
			case 7:
				itemChoices = DefaultItems.allAgesA;
				break;
			default:
				itemChoices = DefaultItems.allAgesB;
				break;
		}

		res.render('partials/itemChoices', { itemChoices }, (error, html) => {
			if (error) {
				this.handleError(res, error);
			} else {
				res.status(200).send({ success: true, html });
			}
		});
	}

	async handleGetChoose(_req: Request, res: Response, _next: NextFunction) {
		try {
			const { user } = res.locals;

			let params = {};

			if (user.userRole === 'partner') {
				const agency = await this.agencyRepository.getAgencyByUserId(user._id);

				if (!agency) {
					return this.handleError(res, 'Agency Not Found', 404);
				}

				params = { ...params, agency };
			}

			this.renderView(res, 'pages/chooseItem', params);
		} catch (error) {
			return this.handleError(res, error);
		}
	}
}
