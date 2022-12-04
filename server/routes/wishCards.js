const express = require('express');

const router = express.Router();
const moment = require('moment');
const rateLimit = require('express-rate-limit');
const log = require('../helper/logger');
const { calculateWishItemTotalPrice } = require('../helper/wishCard.helper');
const {
	createWishcardValidationRules,
	createGuidedWishcardValidationRules,
	getByIdValidationRules,
	updateWishCardValidationRules,
	postMessageValidationRules,
	getDefaultCardsValidationRules,
	validate,
} = require('./validations/wishcards.validations');

const { redirectLogin } = require('./middleware/login.middleware');
const {
	renderPermissions,
	checkVerifiedUser,
	renderPermissionsRedirect,
} = require('./middleware/wishCard.middleware');
const {
	babies,
	preschoolers,
	kids6_8,
	kids9_11,
	teens,
	youth,
	allAgesA,
	allAgesB,
} = require('../utils/defaultItems');
const { handleError } = require('../helper/error');
const WishCardMiddleWare = require('./middleware/wishCard.middleware');
const { getMessageChoices } = require('../utils/defaultMessages');

// IMPORT REPOSITORIES
const UserRepository = require('../db/repository/UserRepository');
const MessageRepository = require('../db/repository/MessageRepository');
const WishCardRepository = require('../db/repository/WishCardRepository');
const AgencyRepository = require('../db/repository/AgencyRepository');
const DonationsRepository = require('../db/repository/DonationRepository');

const WishCardController = require('./controller/wishcard.controller');

// allow only 100 requests per 15 minutes
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
});

router.post(
	'/',
	limiter,
	renderPermissions,
	WishCardMiddleWare.upload.single('wishCardImage'),
	createWishcardValidationRules(),
	validate,
	async (req, res) => {
		if (req.file === undefined) {
			handleError(
				res,
				400,
				'Error: File must be in jpeg, jpg, gif, or png format. The file must also be less than 5 megabytes.',
			);
		} else {
			try {
				const { childBirthday, wishItemPrice } = req.body;

				let filePath;

				if (process.env.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}
				const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);

				const newWishCard = await WishCardRepository.createNewWishCard({
					childBirthday: new Date(childBirthday),
					wishItemPrice: Number(wishItemPrice),
					wishCardImage: process.env.USE_AWS === 'true' ? req.file.Location : filePath,
					createdBy: res.locals.user._id,
					belongsTo: userAgency._id,
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

				res.status(200).send({ success: true, url: '/wishcards/me' });
				log.info('Wishcard created', {
					type: 'wishcard_created',
					agency: userAgency._id,
					wishCardId: newWishCard._id,
				});
			} catch (error) {
				handleError(res, 400, error);
			}
		}
	},
);

router.post(
	'/guided/',
	limiter,
	renderPermissions,
	WishCardMiddleWare.upload.single('wishCardImage'),
	createGuidedWishcardValidationRules(),
	validate,
	async (req, res) => {
		if (req.file === undefined) {
			handleError(
				res,
				400,
				`Error: File must be in jpeg, jpg, gif, or png format. The file
        mst also be less than 5 megabytes.`,
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

				if (process.env.NODE_ENV === 'development') {
					// locally when using multer images are saved inside this folder
					filePath = `/uploads/${req.file.filename}`;
				}

				itemChoice = JSON.parse(itemChoice);
				const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);
				const newWishCard = await WishCardRepository.createNewWishCard({
					childBirthday: new Date(childBirthday),
					wishItemName: itemChoice.Name,
					wishItemPrice: Number(itemChoice.Price),
					wishItemURL: itemChoice.ItemURL,
					wishCardImage: process.env.USE_AWS === 'true' ? req.file.Location : filePath,
					createdBy: res.locals.user._id,
					belongsTo: userAgency._id,
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

				res.status(200).send({ success: true, url: '/wishcards/me' });
				log.info('Wishcard created', {
					type: 'wishcard_created',
					agency: userAgency._id,
					wishCardId: newWishCard._id,
				});
			} catch (error) {
				handleError(res, 400, error);
			}
		}
	},
);

router.post(
	'/edit/:id',
	limiter,
	renderPermissions,
	createWishcardValidationRules(),
	validate,
	async (req, res) => {
		try {
			const { childBirthday, wishItemPrice } = req.body;
			const wishcard = await WishCardRepository.getWishCardByObjectId(req.params.id);

			await WishCardRepository.updateWishCard(wishcard._id, {
				childBirthday: childBirthday ? new Date(childBirthday) : wishcard.childBirthday,
				wishItemPrice: wishItemPrice ? Number(wishItemPrice) : wishcard.wishItemPrice,
				address: {
					address1: req.body.address1 ? req.body.address1 : wishcard.address.address1,
					address2: req.body.address2 ? req.body.address2 : wishcard.address.address2,
					city: req.body.address_city
						? req.body.address_city
						: wishcard.address.address_city,
					state: req.body.address_state
						? req.body.address_state
						: wishcard.address.address_state,
					zip: req.body.address_zip ? req.body.address_zip : wishcard.address.address_zip,
					country: req.body.address_country
						? req.body.address_country
						: wishcard.address.address_country,
				},
				...req.body,
			});

			let url = '/wishcards/me';
			if (res.locals.user.userRole === 'admin') {
				url = '/wishcards/';
			}

			res.status(200).send({ success: true, url });
			log.info('Wishcard Updated', { type: 'wishcard_updated', wishCardId: wishcard.id });
		} catch (error) {
			handleError(res, 400, error);
		}
	},
);

router.delete('/delete/:id', limiter, renderPermissions, async (req, res) => {
	try {
		const wishcard = await WishCardRepository.getWishCardByObjectId(req.params.id);
		const agency = wishcard.belongsTo;

		let url = '/wishcards/';

		if (res.locals.user.userRole !== 'admin') {
			const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);
			if (String(agency._id) !== String(userAgency._id)) {
				return res.status(403).render('403');
			}
			url += 'me';
		}

		await WishCardRepository.deleteWishCard(wishcard._id);

		res.status(200).send({ success: true, url });
		log.info('Wishcard Deleted', { type: 'wishcard_deleted', wishCardId: wishcard.id });
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/', async (_req, res) => {
	try {
		const wishcards = await WishCardRepository.getAllWishCards();

		for (let i = 0; i < wishcards.length; i++) {
			const birthday = moment(new Date(wishcards[i].childBirthday));
			const today = moment(new Date());

			wishcards[i].age = today.diff(birthday, 'years');
		}

		res.status(200).render('wishCards', {
			user: res.locals.user,
			wishcards,
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/me', renderPermissionsRedirect, async (req, res) => {
	try {
		const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);
		const wishCards = await WishCardRepository.getWishCardByAgencyId(userAgency._id);

		const draftWishcards = wishCards.filter((wishcard) => wishcard.status === 'draft');
		const activeWishcards = wishCards.filter((wishcard) => wishcard.status === 'published');
		const inactiveWishcards = wishCards.filter((wishcard) => wishcard.status === 'donated');

		res.render(
			'agencyWishCards',
			{ draftWishcards, activeWishcards, inactiveWishcards },
			(error, html) => {
				if (error) {
					handleError(res, 400, error);
				} else {
					res.status(200).send(html);
				}
			},
		);
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/edit/:id', limiter, renderPermissionsRedirect, async (req, res) => {
	try {
		const wishcard = await WishCardRepository.getWishCardByObjectId(req.params.id);
		const agency = wishcard.belongsTo;
		const { agencyAddress } = agency;

		const childBirthday = moment(wishcard.childBirthday).format('YYYY-MM-DD');

		if (res.locals.user.userRole !== 'admin') {
			const userAgency = await AgencyRepository.getAgencyByUserId(res.locals.user._id);
			if (String(wishcard.belongsTo._id) !== String(userAgency._id)) {
				return res.status(403).send({ success: false, url: '/users/profile' });
			}
		}
		res.render('wishcardEdit', { wishcard, agencyAddress, childBirthday }, (error, html) => {
			if (error) {
				handleError(res, 400, error);
			} else {
				res.status(200).send(html);
			}
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/create', renderPermissionsRedirect, async (_req, res) => {
	try {
		res.status(200).render('createWishcard', {
			user: res.locals.user,
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/admin/', async (req, res) => {
	try {
		// only admin users can get access
		if (res.locals.user.userRole !== 'admin') {
			return res.status(403).render('403');
		}
		// only retrieve wishcards that have a draft status
		const wishcards = await WishCardRepository.getWishCardsByStatus('draft');
		// we need to append each wishcard with some agency details
		const wishCardsWithAgencyDetails = [];

		// There seems to be no way of direct accessing all required information at on so to populate
		// wishcard with agency info we grab wishcards with users and then have to loop through
		// agencies with the user to get agency details. I added a reference for wishcards on agency model
		// but older entries are missing that information
		for (let i = 0; i < wishcards.length; i++) {
			const wishCard = wishcards[i];
			// eslint-disable-next-line no-await-in-loop
			const agencyDetails = wishCard.belongsTo;
			// take only necessary fields from agency that will be displayed on wishcard
			const agencySimple = {
				agencyName: agencyDetails.agencyName,
				agencyPhone: agencyDetails.agencyPhone,
			};
			// merge some agency details with wishcard
			const mergedObj = { ...wishCard.toObject(), ...agencySimple };
			wishCardsWithAgencyDetails.push(mergedObj);
		}

		res.render('adminWishCards', { wishCardsWithAgencyDetails }, (error, html) => {
			if (error) {
				handleError(res, 400, error);
			} else {
				res.status(200).send(html);
			}
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.put('/admin/', async (req, res) => {
	try {
		const USER_ROLE = 'admin';
		// only admin users can get access
		if (res.locals.user.userRole !== USER_ROLE) {
			return res.status(403).render('403');
		}
		const { wishCardId } = req.body;
		const { wishItemURL } = req.body;
		const wishCardModifiedFields = {
			wishItemURL,
			status: 'published',
		};
		await WishCardRepository.updateWishCard(wishCardId, wishCardModifiedFields);
		return res.status(200).send({
			success: true,
			error: null,
			data: null,
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/admin/:wishCardId', async (req, res) => {
	if (!res.locals.user || res.locals.user.userRole !== 'admin') {
		return res.status(403).render('403');
	}

	const { wishCardId } = req.params;

	const donation = await DonationsRepository.getDonationByWishCardId(wishCardId);
	if (!donation) return handleError(res, 400, 'Donation not found');

	const accountManager = await UserRepository.getUserByObjectId(
		donation.donationTo.accountManager,
	);
	if (!accountManager) return handleError(res, 400, 'AccountManager not found');

	res.render('adminDonationDetails', {
		wishCard: donation.donationCard,
		agency: donation.donationTo,
		donation,
		donor: donation.donationFrom,
		accountManager,
	});
});

router.post('/search/:init?', async (req, res) => {
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

		const results = await WishCardController.getWishCardSearchResult(
			wishitem,
			childAge,
			cardIds || [],
			showDonated,
			recentlyAdded,
		);

		res.send({
			user: res.locals.user,
			wishcards: results,
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get('/:id', getByIdValidationRules(), validate, async (req, res) => {
	try {
		const wishcard = await WishCardRepository.getWishCardByObjectId(req.params.id);
		// this agency object is returning undefined and breaking frontend
		const agency = wishcard.belongsTo;
		let birthday;
		if (wishcard.childBirthday) {
			birthday = moment(new Date(wishcard.childBirthday));
			const today = moment(new Date());
			wishcard.age = today.diff(birthday, 'years');
		} else {
			wishcard.age = 'Not Provided';
		}

		const messages = await MessageRepository.getMessagesByWishCardId(wishcard._id);
		let defaultMessages;
		if (res.locals.user) {
			defaultMessages = getMessageChoices(res.locals.user.fName, wishcard.childFirstName);
		}

		// create a page and have a dynamic link for see more
		res.status(200).render('wishCardFullPage', {
			user: res.locals.user,
			wishcard: wishcard || [],
			agency: agency || [],
			messages,
			defaultMessages: defaultMessages || [],
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.get(
	'/donate/:id',
	redirectLogin,
	getByIdValidationRules(),
	redirectLogin,
	async (req, res) => {
		try {
			const wishcard = await WishCardRepository.getWishCardByObjectId(req.params.id);

			// NOTE:
			// this agency object is returning undefined and breaking frontend
			const agency = wishcard.belongsTo;

			// fee for processing item. 3% charged by stripe for processing each card trasaction + 5% from us to cover the possible item price change difference
			const processingFee = 1.08;
			// we are using amazon prime so all shipping is free
			const shipping = 'FREE';
			// Open for discussion. Each state has its own tax so maybe create values for each individual(key-value) or use a defined one for everything since we are
			// doing all the shopping
			const tax = 1.0712;

			const totalItemCost = await calculateWishItemTotalPrice(wishcard.wishItemPrice);

			const extendedPaymentInfo = {
				processingFee: (
					wishcard.wishItemPrice * processingFee -
					wishcard.wishItemPrice
				).toFixed(2),
				shipping,
				tax: (wishcard.wishItemPrice * tax - wishcard.wishItemPrice).toFixed(2),
				totalItemCost,
				agency,
			};

			// I test printed the agency and wishcard object
			// and if we are still using agency array, the matching obj is the 1st one
			// but who knows ¯\_(ツ)_/¯

			res.status(200).render('donate', {
				user: res.locals.user,
				wishcard: wishcard || [],
				extendedPaymentInfo,
				agency,
			});
		} catch (error) {
			handleError(res, 400, error);
		}
	},
);

router.get('/get/random', async (req, res) => {
	try {
		let wishcards = await WishCardRepository.getWishCardsByStatus('published');
		if (!wishcards || wishcards.length < 6) {
			const donatedWishCards = await WishCardRepository.getWishCardsByStatus('donated');
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
				log.error(error);
				res.status(400).json({ success: false, error });
			} else {
				res.status(200).send(html);
			}
		});
	} catch (error) {
		handleError(res, 400, error);
	}
});

router.put(
	'/update/:id',
	renderPermissions,
	updateWishCardValidationRules(),
	validate,
	async (req, res) => {
		// what are we doing here?
		try {
			const result = await WishCardRepository.getWishCardByObjectId(req.params.id);
			// WHERE ARE WE EDITING THIS ON THE FRONT END?
			//     - in /users/profile
			//     - all wishcards created by this user should display
			//     - then add a pencil icon for edit function
			result.save();
		} catch (error) {
			handleError(res, 400, error);
		}
	},
);

router.post(
	'/message',
	checkVerifiedUser,
	postMessageValidationRules(),
	validate,
	async (req, res) => {
		try {
			const { messageFrom, messageTo, message } = req.body;
			const newMessage = await MessageRepository.createNewMessage({
				messageFrom,
				messageTo,
				message,
			});

			res.status(200).send({
				success: true,
				error: null,
				data: newMessage,
			});
		} catch (error) {
			handleError(res, 400, error);
		}
	},
);

router.get(
	'/defaults/:id',
	renderPermissions,
	getDefaultCardsValidationRules(),
	validate,
	async (req, res) => {
		const ageCategory = Number(req.params.id);
		let itemChoices;

		switch (ageCategory) {
			case 1:
				itemChoices = babies;
				break;
			case 2:
				itemChoices = preschoolers;
				break;
			case 3:
				itemChoices = kids6_8;
				break;
			case 4:
				itemChoices = kids9_11;
				break;
			case 5:
				itemChoices = teens;
				break;
			case 6:
				itemChoices = youth;
				break;
			case 7:
				itemChoices = allAgesA;
				break;
			default:
				itemChoices = allAgesB;
				break;
		}

		res.render('itemChoices', { itemChoices }, (error, html) => {
			if (error) {
				handleError(res, 400, error);
			} else {
				res.status(200).send({ success: true, html });
			}
		});
	},
);

module.exports = router;
