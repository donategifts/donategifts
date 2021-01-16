import { injectable, inject } from 'inversify';
import * as express from 'express';
/* import * as moment from 'moment';
import { WishCardRepository } from '@donategifts/wishcard'; */
import { IStripeIntent /* , IDonationInfo, ObjectId */, IDonationHook } from '@donategifts/common';
import { StripeService } from './StripeService';
import { PaypalService } from './PaypalService';
import { handleDonation } from './helper/paymentHelper';

@injectable()
export class PaymentService {
	constructor(
		@inject(StripeService) private stripeService: StripeService,
		@inject(PaypalService) private paypalService: PaypalService,
	) {}

	public async paypalWebhook(
		request: express.Request,
	): Promise<{ success: boolean; error?: string }> {
		return this.paypalService.webHook(request);
	}

	public async stripeIntent(
		stripeData: IStripeIntent,
	): Promise<{ success: boolean; error?: string; clientSecret?: string }> {
		return this.stripeService.createIntent(stripeData);
	}

	public async stripeWebhook(
		request: string,
		stripeSignature: string,
	): Promise<{ success: boolean; error?: string }> {
		return this.stripeService.webHook(request, stripeSignature);
	}

	public async testHandleDonation(donation: IDonationHook): Promise<boolean> {
		return handleDonation(donation);
	}

	// Might not need this route (or maybe repurpose it, depending on how information is handled on frontend
	/* public async onSuccess(
		id: string,
		totalAmount: number,
		email: string,
	): Promise<{ success: boolean; donationInformation?: IDonationInfo; error?: string }> {
		try {
			const wishCard = await WishCardRepository.getWishCardByObjectId(ObjectId(id));
			const currentDate = moment(Date.now());
			const donationInformation: IDonationInfo = {
				email,
				totalAmount,
				orderDate: currentDate.format('MMM D YYYY'),
				itemName: wishCard.wishItemName,
				childName: wishCard.childFirstName,
			};
			return {
				success: true,
				donationInformation,
			};
		} catch (error) {
			return { success: false, error: error.message };
		}
	} */
}
