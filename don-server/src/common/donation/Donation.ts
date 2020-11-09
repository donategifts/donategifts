import type { Document } from 'mongoose';
import type { TypeObjectId } from '../generic';
import type { IDBUser } from '../user';
import type { IDBWishCard } from '../wishcard';

export interface IDBDonation extends Document {
  donationForm: TypeObjectId<IDBUser>;
  donationTo: TypeObjectId<IDBWishCard>;
  donationPrice: number;
  donationConfirmed: boolean;
  donationDate: Date;
}
