import { TypeObjectId } from '../generic';
import { IUser } from '../user';

export interface IDonationHook {
	service: string;
	userId: TypeObjectId<IUser>;
	wishCardId: string;
	amount: number;
	userDonation: string;
	agencyName: string;
}
