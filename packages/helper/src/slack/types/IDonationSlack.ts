import { IWishCard, IUser } from '@donategifts/common';

export interface IDonationSlack {
	service: string;
	userDonation: string;
	donor: IUser;
	wishCard: IWishCard;
	amount: string;
}
