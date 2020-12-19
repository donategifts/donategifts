import { TypeObjectId } from '../generic';
import { IUser } from '../user';
import { IWishCard } from '../wishcard';

export interface IAgency {
	_id: TypeObjectId<IAgency>;
	agencyName: string;
	agencyWebsite: string;
	agencyPhone: string;
	accountManager: TypeObjectId<IUser>;
	agencyBio: string;
	agencyAddress: {
		address1: string;
		address2: string;
		city: string;
		state: string;
		country: string;
		zipcode: string;
	};
	childrenUnderCare: number;
	childrenAgeRange: string;
	agencyProfileImage: string;
	wishCards: TypeObjectId<IWishCard>[];
	joinedBy: TypeObjectId<IUser>;
	joined: Date;
	isVerified: boolean;
}
