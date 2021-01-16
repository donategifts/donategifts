import { injectable } from 'inversify';
import { WishCardRepository } from '@donategifts/wishcard';
import { UserRepository } from '@donategifts/user-data';
import { logger } from '@donategifts/helper';
import Stripe from 'stripe';
import { IDonationHook, IStripeIntent, ObjectId } from '@donategifts/common';
import { calculateWishItemTotalPrice, handleDonation } from './helper/paymentHelper';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const stripe = new Stripe(process.env.STRIPE_KEY!, {
	apiVersion: '2020-08-27',
});

@injectable()
export class StripeService {
	constructor(
		private wishCardRepository: typeof WishCardRepository = WishCardRepository,
		private lastWishcardDonation: string = '',
		private userRepository: typeof UserRepository = UserRepository,
	) {}

	public async createIntent(
		stripeData: IStripeIntent,
	): Promise<{ success: boolean; error?: string; clientSecret?: string }> {
		const { wishCardId, email, agencyName, userDonation, userId } = stripeData;
		// Create a PaymentIntent with the order amount and currency
		const wishCard = await this.wishCardRepository.getWishCardByObjectId(ObjectId(wishCardId));

		const user = await this.userRepository.getUserById(ObjectId(userId));

		// By default stripe accepts "pennies" and we are storing in a full "dollars". 1$ == 100
		// so we need to multiple our price by 100. Genious explanation
		const PENNY = 100;
		let totalItemPrice = await calculateWishItemTotalPrice(wishCard.wishItemPrice);
		if (!wishCard) {
			return { success: false, error: 'Wishcard not found' };
		}
		const metadata: {
			userDonation: number | null;
			wishCardId: string | null;
			userId: string | null;
			agencyName: string | null;
		} = {
			userDonation: null,
			wishCardId: wishCard._id.toString(),
			userId: user._id.toString(),
			agencyName,
		};
		if (userDonation) {
			totalItemPrice += userDonation;
			metadata.userDonation = userDonation;
		}
		const paymentIntent = await stripe.paymentIntents.create({
			amount: Math.floor(totalItemPrice * PENNY),
			currency: 'usd',
			receipt_email: email,
			metadata,
		});

		return {
			success: true,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			clientSecret: paymentIntent.client_secret!,
		};
	}

	public async webHook(
		request: string,
		stripeSignature: string,
	): Promise<{ success: boolean; error?: string }> {
		const endpointSecret = process.env.STRIPE_SECRET;
		if (!endpointSecret) {
			logger.error('Webhook Error - Stripe endpoint secret not set');
			return { success: false, error: 'Webhook Error - Stripe endpoint secret not set' };
		}
		let event;
		try {
			event = stripe.webhooks.constructEvent(request, stripeSignature, endpointSecret);
			const { metadata } = event.data.object;
			if (metadata.wishCardId && this.lastWishcardDonation !== metadata.wishCardId) {
				this.lastWishcardDonation = metadata.wishCardId;

				const donation: IDonationHook = {
					service: 'Stripe',
					userId: metadata.userId,
					wishCardId: metadata.wishCardId,
					amount: event.data.object.amount / 100,
					userDonation: metadata.userDonation,
					agencyName: metadata.agencyName,
				};
				const success: boolean = await handleDonation(donation);
				return { success };
			}
			logger.error('Webhook Error - Metadata not found');
			return { success: false, error: 'Webhook Error - Metadata not found' };
		} catch (err) {
			logger.error(`Webhook Error -  ${err.message}`);
			return { success: false, error: `Webhook Error -  ${err.message}` };
		}
	}
}
