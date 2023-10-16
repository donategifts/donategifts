import { Request, Response, NextFunction } from 'express';
import { Kysely, Selectable } from 'kysely';
import moment from 'moment';

import AgencyRepository from '../../db/repository/postgres/AgenciesRepository';
import ChildrenRepository from '../../db/repository/postgres/ChildrenRepository';
import ItemsRepository from '../../db/repository/postgres/ItemsRepository';
import MessagesRepository from '../../db/repository/postgres/MessagesRepository';
import WishCardRepository from '../../db/repository/postgres/WishCardsRepository';
import { Children, DB, Items, Wishcards } from '../../db/types/generated/database';
import config from '../../helper/config';
import * as DefaultItems from '../../helper/defaultItems';
import Utils from '../../helper/utils';

import BaseApiController from './basecontroller';

export default class WishCardApiController extends BaseApiController {
	private wishCardRepository: WishCardRepository;
	private agencyRepository: AgencyRepository;
	private itemsRepository: ItemsRepository;
	private childrenRepository: ChildrenRepository;
	private messageRepository: MessagesRepository;

	constructor(database: Kysely<DB>) {
		super();

		this.wishCardRepository = new WishCardRepository(database);
		this.agencyRepository = new AgencyRepository(database);
		this.itemsRepository = new ItemsRepository(database);
		this.childrenRepository = new ChildrenRepository(database);
		this.messageRepository = new MessagesRepository(database);

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostIndex = this.handlePostIndex.bind(this);
		this.handlePostGuided = this.handlePostGuided.bind(this);
		this.handleGetEdit = this.handleGetEdit.bind(this);
		this.handlePostEdit = this.handlePostEdit.bind(this);
		this.handleDeleteSingle = this.handleDeleteSingle.bind(this);
		this.handleGetAgency = this.handleGetAgency.bind(this);
		this.handlePostSearch = this.handlePostSearch.bind(this);
		this.handleGetSingle = this.handleGetSingle.bind(this);
		this.handleGetDonate = this.handleGetDonate.bind(this);
		this.handleGetRandom = this.handleGetRandom.bind(this);
		this.handlePostMessage = this.handlePostMessage.bind(this);
		this.handleGetDefaults = this.handleGetDefaults.bind(this);
	}

	async getWishCardSearchResult(
		itemName: string,
		childAge: number,
		cardIds: string[],
		showDonated = false,
		reverseSort = false,
	) {
		const fuzzySearchResult = await this.wishCardRepository.getFuzzy(
			(itemName && itemName.trim()) || '',
			showDonated,
			reverseSort,
			cardIds,
		);

		// remove duplicates
		const allWishCards = fuzzySearchResult.filter(
			(elem, index, self) => index === self.indexOf(elem),
		);

		const wishCardAges: { id: string; age: number }[] = [];

		for (let i = 0; i < allWishCards.length; i++) {
			let childBirthday: number | Date;

			if (allWishCards[i].birth_year) {
				childBirthday = allWishCards[i].birth_year;
			} else {
				childBirthday = new Date();
			}

			const birthday = moment(childBirthday);
			const today = moment(new Date());

			wishCardAges.push({ id: allWishCards[i].id, age: today.diff(birthday, 'year') });
		}

		if (!childAge || childAge === 0) {
			return allWishCards;
		}

		return allWishCards.filter((item) =>
			childAge < 15
				? wishCardAges.find((e) => e.id == item.id)!.age < childAge
				: wishCardAges.find((e) => e.id == item.id)!.age >= childAge,
		);
	}

	async handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		try {
			//To do: may need to modify this call to add item and child information
			const wishcards = await this.wishCardRepository.getRandom('published', 20);

			const data = [] as unknown as Wishcards & { age: number }[];

			for (let i = 0; i < wishcards.length; i++) {
				const birthday = moment(new Date(wishcards[i].birth_year));
				const today = moment(new Date());

				data.push({ ...wishcards[i], age: today.diff(birthday, 'years') });
			}
			return this.sendResponse(res, wishcards);
		} catch (error) {
			this.log.error('[WishcardController] handleGetIndex: ', error);
			return this.handleError(res, error);
		}
	}

	async handlePostIndex(req: Request, res: Response, _next: NextFunction) {
		if (!req.file) {
			this.log.error('[WishcardController] handlePostIndex: No Image File');
			return this.handleError(
				res,
				'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			);
		} else {
			try {
				const { wishItemURL } = req.body;
				const productID = Utils.extractProductIDFromLink(wishItemURL);
				const filePath =
					config.NODE_ENV === 'development' ? `/uploads/${req.file.filename}` : '';

				const userAgency = await this.agencyRepository.getByAccountManagerId(
					res.locals.user.id,
				);

				//To Do: Retailer
				const newItem = await this.itemsRepository.create({
					name: req.body.wishItemName,
					price: req.body.wishItemPrice,
					link: wishItemURL,
					retailer_name: '',
					retailer_product_id: productID,
					image_id: config.AWS.USE ? req.file.Location : filePath,
				});

				//To Do: Child Image
				const newChild = await this.childrenRepository.create({
					first_name: req.body.childFirstName,
					last_name: req.body.childLastName,
					birth_year: req.body.childBirthday,
					interest: req.body.childInterest,
					story: req.body.childStory,
					image_id: '',
					agency_id: userAgency.id,
				});

				const newWishCard = await this.wishCardRepository.create({
					address_line_1: req.body.address1,
					address_line_2: req.body.address2,
					city: req.body.address_city,
					state: req.body.address_state,
					zip_code: req.body.address_zip,
					country_code: req.body.address_country,
					image_id: '',
					child_id: newChild.id,
					item_id: newItem.id,
					created_by: res.locals.user.id,
				});

				this.log.info({
					msg: 'Wishcard created',
					agency: userAgency.id,
					wishCardId: newWishCard.id,
				});
				return this.sendResponse(res, this.formatWishCard(newWishCard, newItem, newChild));
			} catch (error) {
				this.log.error('[WishcardController] handlePostIndex: ', error);
				return this.handleError(res, error);
			}
		}
	}

	async handlePostGuided(req: Request, res: Response, _next: NextFunction) {
		if (!req.file) {
			return this.handleError(
				res,
				'Error: File must be in jpeg, jpg, gif, or png format. The file mst also be less than 5 megabytes.',
			);
		} else {
			try {
				let { itemChoice } = req.body;
				let filePath;

				if (config.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}

				itemChoice = JSON.parse(itemChoice);
				const userAgency = await this.agencyRepository.getByAccountManagerId(
					res.locals.user.id,
				);

				const productID = Utils.extractProductIDFromLink(itemChoice.ItemURL);

				//To Do: Retailer, could skip creating item for guided and reuse (pass in itemId in itemChoice)
				const newItem = await this.itemsRepository.create({
					name: itemChoice.Name,
					price: Number(itemChoice.Price),
					link: itemChoice.ItemURL,
					retailer_name: '',
					retailer_product_id: productID,
					image_id: config.AWS.USE ? req.file.Location : filePath,
				});

				//To Do: Child Image
				const newChild = await this.childrenRepository.create({
					first_name: req.body.childFirstName,
					last_name: req.body.childLastName,
					birth_year: req.body.childBirthday,
					interest: req.body.childInterest,
					story: req.body.childStory,
					image_id: '',
					agency_id: userAgency.id,
				});

				const wishcard = await this.wishCardRepository.create({
					address_line_1: req.body.address1,
					address_line_2: req.body.address2,
					city: req.body.address_city,
					state: req.body.address_state,
					zip_code: req.body.address_zip,
					country_code: req.body.address_country,
					image_id: '',
					child_id: newChild.id,
					item_id: newItem.id,
					created_by: res.locals.user.id,
				});

				this.log.info({
					mgs: 'Wishcard created',
					type: 'wishcard_created',
					agency: userAgency.id,
					wishCardId: wishcard.id,
				});
				return this.sendResponse(res, wishcard);
			} catch (error) {
				this.log.error('[WishcardController] handlePostGuided: ', error);
				return this.handleError(res, error);
			}
		}
	}

	private formatWishCard(
		card: Selectable<Wishcards>,
		wishItem: Selectable<Items>,
		wishChild: Selectable<Children>,
	) {
		const wishcard = {
			childFirstName: wishChild.first_name,
			childLastName: wishChild.last_name,
			childBirthday: wishChild.birth_year,
			childInterest: wishChild.interest,
			wishItemName: wishItem.name,
			wishItemPrice: wishItem.price,
			wishItemURL: wishItem.link,
			childStory: wishChild.story,
			address: {
				address1: card.address_line_1,
				address2: card.address_line_2,
				address_city: card.city,
				address_state: card.state,
				address_zip: card.zip_code,
				address_country: card.country_code,
			},
		};
		return wishcard;
	}

	async handleGetEdit(req: Request, res: Response, _next: NextFunction) {
		try {
			const card = await this.wishCardRepository.getById(req.params.id);
			const wishItem = await this.itemsRepository.getById(card.item_id);
			const wishChild = await this.childrenRepository.getById(card.child_id);
			const agency = await this.agencyRepository.getByAccountManagerId(card.created_by);

			if (res.locals.user.role.toString() !== 'admin') {
				const userAgency = await this.agencyRepository.getByAccountManagerId(
					res.locals.user.id,
				);

				if (agency?.id.toString() !== userAgency?.id.toString()) {
					return res.status(403).send({ success: false, url: '/profile' });
				}
			}

			const agencyAddress = {
				address1: agency.address_line_1,
				address2: agency.address_line_2,
				zipcode: agency.zip_code,
				city: agency.city,
				state: agency.state,
				country: agency.country_code,
			};
			const wishcard = this.formatWishCard(card, wishItem, wishChild);
			const childBirthday = moment(wishcard.childBirthday).format('YYYY');

			return this.sendResponse(res, { wishcard, agencyAddress, childBirthday });
		} catch (error) {
			this.log.error('[WishcardController] handleGetEdit: ', error);
			return this.handleError(res, error);
		}
	}

	async handlePostEdit(req: Request, res: Response, _next: NextFunction) {
		try {
			const { wishItemURL } = req.body;
			const card = await this.wishCardRepository.getById(req.params.id);
			const productID = Utils.extractProductIDFromLink(wishItemURL);
			const filePath =
				config.NODE_ENV === 'development' ? `/uploads/${req.file.filename}` : '';

			const userAgency = await this.agencyRepository.getByAccountManagerId(
				res.locals.user.id,
			);

			//To Do: Retailer
			await this.itemsRepository.update(card.item_id, {
				name: req.body.wishItemName,
				price: req.body.wishItemPrice,
				link: wishItemURL,
				retailer_name: '',
				retailer_product_id: productID,
				image_id: config.AWS.USE ? req.file.Location : filePath,
			});

			//To Do: Child Image
			await this.childrenRepository.updateById(card.child_id, {
				first_name: req.body.childFirstName,
				last_name: req.body.childLastName,
				birth_year: req.body.childBirthday,
				interest: req.body.childInterest,
				story: req.body.childStory,
				image_id: '',
				agency_id: userAgency.id,
			});

			await this.wishCardRepository.update(card.id, {
				address_line_1: req.body.address1 ? req.body.address1 : card.address_line_1,
				address_line_2: req.body.address2 ? req.body.address2 : card.address_line_2,
				city: req.body.address_city ? req.body.address_city : card.city,
				state: req.body.address_state ? req.body.state : card.state,
				zip_code: req.body.address_zip ? req.body.address_zip : card.zip_code,
				country_code: req.body.address_country ? req.body.country : card.country_code,
				image_id: '',
			});

			let url = '/wishcards/manage';
			if (res.locals.user.role === 'admin') {
				url = '/wishcards/';
			}

			this.log.info({
				mgs: 'Wishcard Updated',
				wishCardId: card.id,
			});

			return this.sendResponse(res, { success: true, url });
		} catch (error) {
			this.log.error('[WishcardController] handlePostEdit: ', error);
			return this.handleError(res, error);
		}
	}

	async handleDeleteSingle(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getById(req.params.id);
			const agency = await this.agencyRepository.getByAccountManagerId(wishcard.created_by);

			let url = '/wishcards/';

			if (res.locals.user.role !== 'admin') {
				const userAgency = await this.agencyRepository.getByAccountManagerId(
					res.locals.user.id,
				);
				if (String(agency.id) !== String(userAgency?.id)) {
					return res.status(403).render('403');
				}
				url += 'me';
			}

			await this.wishCardRepository.delete(wishcard.id);

			this.log.info({
				mgs: 'Wishcard Deleted',
				wishCardId: wishcard?.id,
			});
			return this.sendResponse(res, { success: true, url });
		} catch (error) {
			this.log.error('[WishcardController] handleDeleteSingle: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetAgency(_req: Request, res: Response, _next: NextFunction) {
		try {
			const userAgency = await this.agencyRepository.getByAccountManagerId(
				res.locals.user.id,
			);
			const wishCards = await this.wishCardRepository.getByAgencyId(userAgency.id);

			const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
			const activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
			const inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');

			return this.sendResponse(res, { draftWishcards, activeWishcards, inactiveWishcards });
		} catch (error) {
			this.log.error('[WishcardController] handleGetAgency: ', error);
			return this.handleError(res, error);
		}
	}

	async handlePostSearch(req: Request, res: Response, _next: NextFunction) {
		try {
			const { wishitem, showDonatedCheck, younger, older, cardIds, recentlyAdded } = req.body;

			let childAge: number;
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

			const wishcards = await this.getWishCardSearchResult(
				wishitem,
				// childAge is set to 0 on initial visit
				childAge!,
				cardIds || [],
				showDonated,
				recentlyAdded,
			);

			return this.sendResponse(res, {
				user: res.locals.user,
				wishcards,
			});
		} catch (error) {
			this.log.error('[WishcardController] handlePostSearch: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetSingle(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getById(req.params.id);

			const agency = await this.agencyRepository.getByAccountManagerId(wishcard.created_by);
			const messages = await this.messageRepository.getByWishCardId(wishcard.id);
			const child = await this.childrenRepository.getById(wishcard.child_id);

			let defaultMessages: string[] = [];

			if (res.locals.user) {
				defaultMessages = Utils.getMessageChoices(
					res.locals.user.first_name,
					child.first_name,
				);
			}

			return this.sendResponse(res, {
				wishcard: {
					...wishcard,
					age: child.birth_year
						? moment(new Date()).diff(child.birth_year, 'years')
						: 'Not Provided',
				},
				agency: agency || {},
				messages,
				defaultMessages,
			});
		} catch (error) {
			this.log.error('[WishcardController] handleGetSingle: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetDonate(req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcard = await this.wishCardRepository.getById(req.params.id);

			const agency = await this.agencyRepository.getByAccountManagerId(wishcard.created_by);
			const wishItem = await this.itemsRepository.getById(wishcard.item_id);
			const processingFee = 1.08;
			const shipping = 'FREE';
			const tax = 1.0712;

			const totalItemCost = await Utils.calculateWishItemTotalPrice(wishItem.price);
			const Itemprice = Number(wishItem.price);

			const extendedPaymentInfo = {
				processingFee: (Itemprice * processingFee - Itemprice).toFixed(2),
				shipping,
				tax: (Itemprice * tax - Itemprice).toFixed(2),
				totalItemCost,
				agency,
			};

			return this.sendResponse(res, {
				wishcard: wishcard || [],
				extendedPaymentInfo,
				agency,
			});
		} catch (error) {
			this.log.error('[WishcardController] handleGetDonate: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetRandom(_req: Request, res: Response, _next: NextFunction) {
		try {
			const wishcards = await this.wishCardRepository.getRandom('published', 6);

			return this.sendResponse(res, { wishcards });
		} catch (error) {
			this.log.error('[WishcardController] handleGetRandom: ', error);
			return this.handleError(res, error);
		}
	}

	async handlePostMessage(req: Request, res: Response, _next: NextFunction) {
		try {
			const { messageFrom, messageTo, message } = req.body;
			const newMessage = await this.messageRepository.create({
				content: message,
				sender_id: messageFrom,
				wishcard_id: messageTo,
			});

			return this.sendResponse(res, {
				data: newMessage,
			});
		} catch (error) {
			this.log.error('[WishcardController] handlePostMessage: ', error);
			return this.handleError(res, error);
		}
	}

	async handleGetDefaults(req: Request, res: Response, _next: NextFunction) {
		try {
			const ageCategory = Number(req.params.id);
			let itemChoices: {
				Image: string;
				Name: string;
				Price: number;
				ItemURL: string;
			}[];

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

			return this.sendResponse(res, itemChoices);
		} catch (error) {
			this.log.error('[WishcardController] handleGetDefaults: ', error);
			return this.handleError(res, error);
		}
	}
}
