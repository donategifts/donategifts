import { Request, Response, NextFunction } from 'express';
import moment from 'moment';

import WishCard from '../db/models/WishCard';
import AgencyRepository from '../db/repository/AgencyRepository';
import MessageRepository from '../db/repository/MessageRepository';
import UserRepository from '../db/repository/UserRepository';
import WishCardRepository from '../db/repository/WishCardRepository';
import config from '../helper/config';
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
		this.handleGetAgency = this.handleGetAgency.bind(this);
		this.handleGetCreate = this.handleGetCreate.bind(this);
		this.handlePostSearch = this.handlePostSearch.bind(this);
		this.handleGetSingle = this.handleGetSingle.bind(this);
		this.handleGetDonate = this.handleGetDonate.bind(this);
		this.handleGetRandom = this.handleGetRandom.bind(this);
		this.handlePostMessage = this.handlePostMessage.bind(this);
		this.handleGetDefaults = this.handleGetDefaults.bind(this);
	}

	async getWishCardSearchResult(
		itemName,
		childAge,
		cardIds,
		showDonated = false,
		reverseSort = false,
		agencyFilter = null,
		priceSlider = [],
		priceSortOrder = null,
	) {
		let fuzzySearchResult = await this.wishCardRepository.getWishCardsFuzzy(
			(itemName && itemName.trim()) || '',
			showDonated,
			reverseSort,
			priceSortOrder,
			cardIds,
		);

		if (agencyFilter) {
			fuzzySearchResult = fuzzySearchResult.filter(
				(card) => card.belongsTo?.toString() == agencyFilter,
			);
		}

		// remove duplicates
		let allWishCards = fuzzySearchResult.filter(
			(elem, index, self) => index === self.indexOf(elem),
		);

		if (priceSlider.length > 0) {
			allWishCards = allWishCards.filter(
				(card) =>
					card.wishItemPrice >= priceSlider[0] && card.wishItemPrice <= priceSlider[1],
			);
		}

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

	async getLockedWishCards(req: Request, res: Response, _next: NextFunction) {
		const response: {
			userId?: string;
			wishCardId?: string;
			alreadyLockedWishCard?: any;
			error?: string;
		} = {
			wishCardId: req.params.id,
		};

		const user = await this.userRepository.getUserByObjectId(res.locals.user._id);
		if (!user) {
			response.error = 'User not found';
			return response;
		}
		response.userId = user._id;
		response.alreadyLockedWishCard = await this.wishCardRepository.getLockedWishcardsByUserId(
			res.locals.user._id,
		);

		return response;
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcards = await this.wishCardRepository.getAll();
			const agencyIds = wishcards
				.map((card) => card.belongsTo?.toString())
				.filter((elem, index, self) => index === self.indexOf(elem));
			const verifiedAgencies = await this.agencyRepository.getVerifiedAgencies();
			const agencies = verifiedAgencies
				?.filter((agency) => agencyIds.includes(agency._id.toString()))
				.map((agency) => {
					return { agencyName: agency.agencyName, _id: agency._id };
				})
				.sort((a, b) => a.agencyName.localeCompare(b.agencyName));

			const data = [] as unknown as WishCard & { age: number }[];
			let birthday: moment.Moment;
			for (let i = 0; i < wishcards.length; i++) {
				if (wishcards[i].childBirthYear) {
					birthday = moment(new Date(wishcards[i].childBirthYear));
				} else {
					birthday = moment(new Date(wishcards[i].childBirthday));
				}
				const today = moment(new Date());

				data.push({ ...wishcards[i], age: today.diff(birthday, 'years') });
			}

			this.renderView(res, 'wishcards', {
				wishcards: data,
				agencies,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	async handlePostIndex(req: Request, res: Response, _next: NextFunction) {
		if (!req.file) {
			this.handleError(
				res,
				'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			);
		} else {
			try {
				const { childBirthday, wishItemPrice, wishItemURL } = req.body;
				const productID = Utils.extractProductIDFromLink(wishItemURL);
				const filePath =
					config.NODE_ENV === 'development' ? `/uploads/${req.file.filename}` : '';

				const userAgency = await this.agencyRepository.getAgencyByUserId(
					res.locals.user._id,
				);

				const newWishCard = await this.wishCardRepository.createNewWishCard({
					childBirthday: new Date(childBirthday),
					wishItemPrice: Number(wishItemPrice),
					productID,
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

				return res.status(200).send({ success: true, url: '/wishcards/manage' });
			} catch (error) {
				return this.handleError(res, error);
			}
		}
	}

	async handlePostGuided(req: Request, res: Response, _next: NextFunction) {
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
				return res.status(200).send({ success: true, url: '/wishcards/manage' });
			} catch (error) {
				return this.handleError(res, error);
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

			return this.renderView(res, 'wishcard/edit', {
				wishcard,
				agencyAddress,
				childBirthday,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handlePostEdit(req: Request, res: Response, _next: NextFunction) {
		try {
			const { childBirthday, wishItemPrice } = req.body;
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			await this.wishCardRepository.updateWishCardByObjectId(wishcard!._id, {
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

			let url = '/wishcards/manage';
			if (res.locals.user.userRole === 'admin') {
				url = '/wishcards/';
			}

			this.log.info({
				mgs: 'Wishcard Updated',
				wishCardId: wishcard?._id,
			});

			return res.status(200).send({ success: true, url });
		} catch (error) {
			return this.handleError(res, error);
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

			return res.status(200).send({ success: true, url });
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetAgency(_req: Request, res: Response, _next: NextFunction) {
		try {
			const userAgency = await this.agencyRepository.getAgencyByUserId(res.locals.user._id);
			const wishCards = await this.wishCardRepository.getWishCardByAgencyId(userAgency!._id);

			const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
			const activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
			const inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');

			this.renderView(res, 'wishcard/agencycards', {
				draftWishcards,
				activeWishcards,
				inactiveWishcards,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}

	handleGetCreate(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'wishcard/create');
	}

	async handlePostSearch(req: Request, res: Response, _next: NextFunction) {
		try {
			const {
				wishitem,
				showDonatedCheck,
				younger,
				older,
				cardIds,
				recentlyAdded,
				agencyFilter,
				priceSlider,
				priceSortOrder,
			} = req.body;

			let childAge;
			let showDonated = showDonatedCheck === 'yes' ? true : false;

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
				agencyFilter,
				priceSlider,
				priceSortOrder,
			);

			return res.status(200).send({
				user: res.locals.user,
				wishcards: results,
			});
		} catch (error) {
			return this.handleError(res, error);
		}
	}

	async handleGetSingle(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			// this agency object is returning undefined and breaking frontend
			const agency = wishcard!.belongsTo;

			agency.agencyWebsite = Utils.ensureProtocol(agency.agencyWebsite);

			const birthday = wishcard?.childBirthYear
				? moment(new Date(wishcard.childBirthYear))
				: wishcard?.childBirthday
				? moment(new Date(wishcard.childBirthday))
				: undefined;

			const age = birthday?.isValid()
				? moment(new Date()).diff(birthday, 'years')
				: 'Not Provided';

			this.renderView(res, 'wishcard/single', {
				wishcard: {
					...wishcard,
					age,
				},
			});
		} catch (error) {
			this.handleError(res, error, 404, true);
		}
	}

	async handleGetDonate(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getWishCardByObjectId(req.params.id);

			// if card is donated throw an error
			if (wishcard?.status === 'donated') {
				this.handleError(res, 'Wishcard already donated', 404, true);
				return;
			}

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

			this.renderView(res, 'wishcard/donate', {
				wishcard: wishcard || [],
				extendedPaymentInfo,
				agency,
			});
		} catch (error) {
			this.handleError(res, error, 404, true);
		}
	}

	async handleGetRandom(_req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcards = await this.wishCardRepository.getRandom('published', 6);

			res.render('components/homeSampleCards', { wishcards }, (error, html) => {
				if (error) {
					throw error;
				} else {
					return res.status(200).send(html);
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

			return res.status(200).send({
				data: newMessage,
			});
		} catch (error) {
			return this.handleError(res, error);
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
				return this.handleError(res, error);
			}

			return res.status(200).send({ success: true, html });
		});
	}
}
