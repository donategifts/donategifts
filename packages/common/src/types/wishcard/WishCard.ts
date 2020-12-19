import { IAgency } from '../agency';
import { TypeObjectId } from '../generic';
import { IMessage } from '../message';
import { IUser } from '../user';

export enum WishCardStatus {
	Draft = 'draft',
	Published = 'published',
	Donated = 'donated',
}

export interface IWishCard {
	_id: TypeObjectId<IWishCard>;
	childFirstName: string;
	childLastName: string;
	childBirthday: Date;
	childInterest: string;
	wishItemName: string;
	wishItemPrice: number;
	wishItemURL: string;
	childStory: string;
	wishCardImage: string;
	createdBy: TypeObjectId<IUser>;
	createdAt: Date;
	deliveryDate: Date;
	occasion: string;
	address: {
		address1: string;
		address2: string;
		city: string;
		state: string;
		country: string;
		zipcode: string;
	};
	isDonated: boolean;
	isLockedBy: TypeObjectId<IUser> | null;
	isLockedUntil: Date | null;
	approvedByAdmin: boolean;
	messages: TypeObjectId<IMessage>[];
	status: WishCardStatus;
	wishCardTo: TypeObjectId<IAgency>;
}
