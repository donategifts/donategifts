import { Request, Response, NextFunction } from 'express';
import { Kysely } from 'kysely';
import moment from 'moment';
import PayPal, { notification } from 'paypal-rest-sdk';
import Stripe from 'stripe';

import AgenciesRepository from '../../db/repository/postgres/AgenciesRepository';
import ChildrenRepository from '../../db/repository/postgres/ChildrenRepository';
import ItemsRepository from '../../db/repository/postgres/ItemsRepository';
import UsersRepository from '../../db/repository/postgres/UsersRepository';
import WishCardsRepository from '../../db/repository/postgres/WishCardsRepository';
import { DB } from '../../db/types/generated/database';
import config from '../../helper/config';
import Messaging from '../../helper/messaging';
import Utils from '../../helper/utils';

import BaseController from './basecontroller';

export default class PaymentProviderController extends BaseController {
	private wishcardsRepository: WishCardsRepository;
	private usersRepository: UsersRepository;
	private agenciesRepository: AgenciesRepository;
	private childrenRepository: ChildrenRepository;
	private itemsRepository: ItemsRepository;
	private stripeClient: Stripe;
	private lastWishcardDonation: string;
	constructor(database: Kysely<DB>) {
		super();

		PayPal.configure({
			mode: config.NODE_ENV === 'development' ? 'sandbox' : 'live', // sandbox or live
			client_id: config.PAYPAL.CLIENT_ID,
			client_secret: config.PAYPAL.SECRET,
		});

		this.stripeClient = new Stripe(config.STRIPE.SECRET_KEY, {
			apiVersion: '2022-11-15',
			typescript: true,
		});

		this.wishcardsRepository = new WishCardsRepository(database);
		this.usersRepository = new UsersRepository(database);
		this.agenciesRepository = new AgenciesRepository(database);
		this.childrenRepository = new ChildrenRepository(database);
		this.itemsRepository = new ItemsRepository(database);

		this.lastWishcardDonation = '';
	}

	async handleDonation({ service, userId, wishCardId, amount, userDonation, agencyName }) {
		try {
			const user = await this.usersRepository.getById(userId);
			const wishCard = await this.wishcardsRepository.getById(wishCardId);
			const agency = await this.agenciesRepository.getByName(agencyName);

			const child = await this.childrenRepository.getById(wishCard.child_id);
			const item = await this.itemsRepository.getById(wishCard.item_id);

			await this.wishcardsRepository.update(wishCard.id, {
				status: 'donated',
			});

			this.log.info('Sending donation confirmation email');
			await Messaging.sendDonationConfirmationEmail({
				email: user.email,
				firstName: user.first_name,
				lastName: user.last_name,
				childName: child.name,
				item: item.name,
				price: item.price,
				agency: agencyName,
			});

			const accountManager = await this.usersRepository.getById(agency.account_manager_id);

			this.log.info('Sending agency donation email');
			await Messaging.sendAgencyDonationEmail({
				agencyName: agency.name,
				agencyEmail: accountManager.email,
				childName: child.name,
				item: item.name,
				price: item.price,
				donationDate: `${moment(new Date()).format('MMM Do, YYYY')}`,
				address: `${agency.address_line_1} ${agency.address_line_2}, ${agency.city}, ${agency.state} ${agency.zip_code}`,
			});

			this.log.info('Sending discord donation notification');
			await Messaging.sendDiscordDonationNotification({
				user: user.first_name,
				service,
				wishCard: {
					item: item.name,
					url: item.link,
					child: child.name,
				},
				donation: {
					amount,
					userDonation,
				},
			});
		} catch (error) {
			this.log.error(error);
		}
	}

	async handlePostCreateIntent(req: Request, res: Response, _next: NextFunction) {
		const { wishCardId, email, agencyName, userDonation } = req.body;

		// Create a PaymentIntent with the order amount and currency
		const wishCard = await this.wishcardsRepository.getById(wishCardId);
		const item = await this.itemsRepository.getById(wishCard.item_id);

		if (wishCard) {
			// By default stripe accepts "pennies" and we are storing in a full "dollars". 1$ == 100
			// so we need to multiple our price by 100. Genious explanation
			const PENNY = 100;
			let totalItemPrice = parseFloat(await Utils.calculateWishItemTotalPrice(item.price));

			if (userDonation) {
				totalItemPrice += parseFloat(userDonation);
			}

			const paymentIntent = await this.stripeClient.paymentIntents.create({
				amount: Math.floor(totalItemPrice * PENNY),
				currency: 'usd',
				receipt_email: email,
				metadata: {
					wishCardId: wishCard.id,
					userId: res.locals.user.id,
					agencyName,
					userDonation,
					amount: totalItemPrice,
				},
			});

			return this.sendResponse(res, {
				clientSecret: paymentIntent.client_secret,
			});
		} else {
			return this.handleError(res, 'Wishcard not found');
		}
	}

	async handlePostStripeWebhook(req: Request, res: Response, _next: NextFunction) {
		const signature = req.headers['stripe-signature'];

		// STRIPE WEBHOOK
		if (signature) {
			let secret = config.STRIPE.SIGNING_SECRET;

			if (config.NODE_ENV === 'development' && config.STRIPE.SIGNING_SECRET_LOCAL) {
				secret = config.STRIPE.SIGNING_SECRET_LOCAL;
			}

			try {
				const event = this.stripeClient.webhooks.constructEvent(
					req.rawBody,
					signature,
					secret,
				);

				if (this.lastWishcardDonation !== event.data.object.metadata.wishCardId) {
					this.lastWishcardDonation = event.data.object.metadata.wishCardId;

					await this.handleDonation({
						service: 'Stripe',
						userId: event.data.object.metadata.userId,
						wishCardId: event.data.object.metadata.wishCardId,
						amount: event.data.object.metadata.amount,
						userDonation: event.data.object.metadata.userDonation,
						agencyName: event.data.object.metadata.agencyName,
					});
				}
			} catch (error) {
				this.log.error('Webhook Error:', error);
				return this.handleError(res, `Webhook Error: ${error}`);
			}
		}

		return res.json({ received: true });
	}

	async handlePostPaypalWebhook(req: Request, res: Response, _next: NextFunction) {
		// PAYPAL WEBHOOK
		if (req.body.event_type === 'CHECKOUT.ORDER.APPROVED') {
			PayPal.notification.webhookEvent.getAndVerify(
				req.rawBody as notification.webhookEvent.WebhookEvent,
				async (error, _response) => {
					if (error) {
						this.log.info(error);
						throw error;
					} else {
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
				},
			);

			return res.json({ received: true });
		}

		return this.handleError(res, `Paypal webhook error, event_type: ${req.body.event_type}`);
	}
}
