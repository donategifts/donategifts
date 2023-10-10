import 'stripe';

declare module 'stripe' {
	namespace Stripe {
		namespace Event {
			namespace Data {
				interface Object {
					amount: number;
					metadata: {
						wishCardId: string;
						userId: string;
						userDonation: string;
						agencyName: string;
						amount: string;
					};
				}
			}
		}
	}
}
