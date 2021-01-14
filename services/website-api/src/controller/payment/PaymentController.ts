import * as express from 'express';
import { PaymentService } from '@donategifts/payment';
import {
	/* IUser, */ IDonationHook,
	IStripeIntent /* , IDonationInfo */,
} from '@donategifts/common';
import {
	Controller,
	Post,
	Route,
	Tags,
	Response,
	Body,
	Header,
	Request,
	/* Get,
	Path */
} from '@tsoa/runtime';

// Changed route to /payment since it contains both stripe and paypal; v1 used /stripe, even though contained both paypal and stripe
@Route('/payment')
@Tags('payment')
export class PaymentController extends Controller {
	constructor(private paymentService: typeof PaymentService = PaymentService) {
		super();
	}

	@Response('400', 'Bad request')
	@Post('/createIntent')
	public async createIntent(
		@Body() stripeData: IStripeIntent,
	): Promise<{ success: boolean; error?: string; clientSecret?: string }> {
		return this.paymentService.stripeIntent(stripeData);
	}

	@Response('400', 'Bad request')
	@Post('/webhook')
	public async callWebHook(
		@Request() request: express.Request,
		@Header('stripe-signature') stripe_signature?: string,
	): Promise<{ success: boolean; error?: string }> {
		if (stripe_signature) {
			return this.paymentService.stripeWebhook(JSON.stringify(request.body), stripe_signature);
		}
		return this.paymentService.paypalWebhook(request);
	}

	@Response('400', 'Bad request')
	@Post('/test')
	public async test(@Body() donation: IDonationHook): Promise<boolean> {
		return this.paymentService.testHandleDonation(donation);
	}

	// Might not need this route (or maybe repurpose it, depending on how information is handled on frontend
	/* @Response('400', 'Bad request')
	@Post('/payment/success/{id}&{totalAmount}')
	public async onSuccess(
		@Path() id: string,
		@Path() totalAmount: number,
		@Body() user: IUser,
	): Promise<{ success: boolean; donationInformation?: IDonationInfo; error?: string }> {
		return this.paymentService.onSuccess(id, totalAmount, user.email);
	} */
}
