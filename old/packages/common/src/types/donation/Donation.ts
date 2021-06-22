import type { TypeObjectId } from '../generic';
import type { IUser } from '../user';
import type { IWishCard } from '../wishcard';

/** tsoaModel */
export interface IDonation {
	_id: TypeObjectId<IDonation>;
	donationFrom: TypeObjectId<IUser>;
	donationTo: TypeObjectId<IWishCard>;
	donationPrice: number;
	donationConfirmed: boolean;
	donationDate: Date;
}
