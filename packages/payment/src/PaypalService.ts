import { injectable } from 'inversify';
import * as express from 'express';
import * as paypal from 'paypal-rest-sdk';
import { logger } from '@donategifts/helper';
import { IDonationHook } from '@donategifts/common';
import { handleDonation } from './helper/paymentHelper';

paypal.configure({
	mode: process.env.NODE_ENV === 'development' ? 'sandbox' : 'live', // sandbox or live
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	client_id: process.env.PAYPAL_CLIENT_ID!,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	client_secret: process.env.PAYPAL_SECRET!,
});

@injectable()
export class PaypalService {
	public async webHook(request: express.Request): Promise<{ success: boolean; error?: string }> {
		if (request.body.event_type === 'CHECKOUT.ORDER.APPROVED') {
			paypal.notification.webhookEvent.getAndVerify(
				JSON.stringify(request.body) as paypal.notification.webhookEvent.WebhookEvent,
				async (error, response) => {
					if (error) {
						logger.info(error);
						return { success: false, error: `Webhook Error - ${error.message}` };
					}
					// needed to shut up lint
					logger.info(response);

					const data = request.body.resource.purchase_units[0].reference_id.split('%');

					const donation: IDonationHook = {
						service: 'Paypal',
						userId: data[0],
						wishCardId: data[1],
						amount: request.body.resource.purchase_units[0].amount.value,
						userDonation: data[2],
						agencyName: data[3],
					};

					const success: boolean = await handleDonation(donation);
					return {
						success,
					};
				},
			);
		}
		logger.debug('Webhook Error - Checkout order not approved');
		return {
			success: false,
			error: 'Webhook Error - Paypal Checkout order not approved',
		};
	}
}
