import { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import paypal from 'paypal-rest-sdk';

import AgencyRepository from '../db/repository/AgencyRepository';
import DonationRepository from '../db/repository/DonationRepository';
import UserRepository from '../db/repository/UserRepository';
import WishCardRepository from '../db/repository/WishCardRepository';
import config from '../helper/config';
import Messaging from '../helper/messaging';
import Utils from '../helper/utils';

import BaseController from './basecontroller';

const stripe = require('stripe')(config.STRIPE.SECRET);

export default class PaymentProviderController extends BaseController {
	private lastWishcardDonation: string;

	private wishCardRepository: WishCardRepository;

	private userRepository: UserRepository;

	private donationRepository: DonationRepository;

	private agencyRepository: AgencyRepository;

	constructor() {
		super();

		paypal.configure({
			mode: config.NODE_ENV === 'development' ? 'sandbox' : 'live', // sandbox or live
			client_id: config.PAYPAL.CLIENT_ID,
			client_secret: config.PAYPAL.SECRET,
		});

		this.wishCardRepository = new WishCardRepository();
		this.userRepository = new UserRepository();
		this.donationRepository = new DonationRepository();
		this.agencyRepository = new AgencyRepository();

		this.lastWishcardDonation = '';

		this.handlePostCreateIntent = this.handlePostCreateIntent.bind(this);
		this.handleGetPaymentSuccess = this.handleGetPaymentSuccess.bind(this);
		this.handlePostWebhook = this.handlePostWebhook.bind(this);
	}

	async handleDonation({ service, userId, wishCardId, amount, userDonation, agencyName }) {
		const user = await this.userRepository.getUserByObjectId(userId);
		const wishCard = await this.wishCardRepository.getWishCardByObjectId(wishCardId);
		const agency = await this.agencyRepository.getAgencyByName(agencyName);

		if (user) {
			const emailResponse = await Messaging.sendDonationConfirmationMail({
				email: user.email,
				firstName: user.fName,
				lastName: user.lName,
				childName: wishCard?.childFirstName,
				item: wishCard?.wishItemName,
				price: wishCard?.wishItemPrice,
				agency: agencyName,
			});

			if (config.NODE_ENV === 'development') {
				const response = emailResponse ? emailResponse.data : '';
				this.log.info(response);
			}

			await this.donationRepository.createNewDonation({
				donationFrom: user._id.toString(),
				donationTo: wishCard!.belongsTo._id.toString(),
				donationCard: wishCard!._id.toString(),
				donationPrice: amount,
			});

			await this.wishCardRepository.updateWishCard(wishCard!._id, { status: 'donated' });

			await Messaging.sendAgencyDonationAlert({
				firstName: user.fName,
				lastName: user.lName,
				email: agency?.accountManager.email,
				item: wishCard?.wishItemName,
				price: wishCard?.wishItemPrice,
				childName: wishCard?.childFirstName,
				agency: agencyName,
			});

			await Messaging.sendDiscordDonationNotification({
				user: user.fName,
				service,
				wishCard: {
					item: wishCard?.wishItemName,
					url: wishCard?.wishItemURL,
					child: wishCard?.childFirstName,
				},
				donation: {
					amount,
					userDonation,
				},
			});
		}
	}

	async handlePostCreateIntent(req: Request, res: Response, _next: NextFunction) {
		const { wishCardId, email, agencyName, userDonation } = req.body;
		// Create a PaymentIntent with the order amount and currency
		const wishCard = await this.wishCardRepository.getWishCardByObjectId(wishCardId);

		if (wishCard) {
			// By default stripe accepts "pennies" and we are storing in a full "dollars". 1$ == 100
			// so we need to multiple our price by 100. Genious explanation
			const PENNY = 100;
			let totalItemPrice = parseFloat(
				await Utils.calculateWishItemTotalPrice(wishCard.wishItemPrice),
			);

			if (userDonation) {
				totalItemPrice += parseFloat(userDonation);
			}

			const paymentIntent = await stripe.paymentIntents.create({
				amount: Math.floor(totalItemPrice * PENNY),
				currency: 'usd',
				receipt_email: email,
				metadata: {
					wishCardId: wishCard._id.toString(),
					userId: res.locals.user._id.toString(),
					agencyName,
					userDonation,
				},
			});

			res.send({
				clientSecret: paymentIntent.client_secret,
			});
		} else {
			this.handleError(res, 'Wishcard not found');
		}
	}

	async handlePostWebhook(req: Request, res: Response, _next: NextFunction) {
		const sig = req.headers['stripe-signature'];

		// STRIPE WEBHOOK
		if (sig) {
			const endpointSecret = config.STRIPE.SECRET;
			let event;

			try {
				event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

				if (this.lastWishcardDonation !== event.data.object.metadata.wishCardId) {
					this.lastWishcardDonation = event.data.object.metadata.wishCardId;

					await this.handleDonation({
						service: 'Stripe',
						userId: event.data.object.metadata.userId,
						wishCardId: event.data.object.metadata.wishCardId,
						amount: event.data.object.amount / 100,
						userDonation: event.data.object.metadata.userDonation,
						agencyName: event.data.object.metadata.agencyName,
					});
				}
			} catch (error) {
				res.status(400).send(`Webhook Error: ${error}`);
			}
		}

		// PAYPAL WEBHOOK
		if (req.body.event_type === 'CHECKOUT.ORDER.APPROVED') {
			paypal.notification.webhookEvent.getAndVerify(req.rawBody, async (error, response) => {
				if (error) {
					this.log.info(error);
					throw error;
				} else {
					// needed to shut up lint
					this.log.info(response);

					const data = req.body.resource.purchase_units[0].reference_id.split('%');
					const userId = data[0];
					const wishCardId = data[1];
					const userDonation = data[2];
					const agencyName = data[3];
					const amount = req.body.resource.purchase_units[0].amount.value;

					await this.handleDonation({
						service: 'Paypal',
						userId,
						wishCardId,
						amount,
						userDonation,
						agencyName,
					});
				}
			});
		}

		res.json({ received: true });
	}

	async handleGetPaymentSuccess(req: Request, res: Response, _next: NextFunction) {
		try {
			const { id, totalAmount } = req.params;
			const wishCard = await this.wishCardRepository.getWishCardByObjectId(id);
			const currentDate = moment(Date.now());
			const donationInformation = {
				email: res.locals.user.email,
				totalAmount,
				orderDate: currentDate.format('MMM D YYYY'),
				itemName: wishCard?.wishItemName,
				childName: wishCard?.childFirstName,
			};

			this.renderView(res, 'successPayment', {
				donationInformation,
			});
		} catch (error) {
			this.handleError(res, error);
		}
	}
}
