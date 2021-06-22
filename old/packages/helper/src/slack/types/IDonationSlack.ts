import { IWishCard, IUser } from '@donategifts/common';

export interface IDonationSlack {
	service: string;
	userDonation: number | null;
	donor: IUser;
	wishCard: IWishCard;
	amount: number;
}
