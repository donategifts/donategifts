import { Schema, Document, model, Model } from 'mongoose';
import { IDBWishCard } from './WishCard';
import { TypeObjectId } from '../../common';
import { IDBUser } from './User';

export interface IDBDonation extends Document {
  donationForm: TypeObjectId<IDBUser>;
  donationTo: TypeObjectId<IDBWishCard>;
  donationPrice: number;
  donationConfirmed: boolean;
  donationDate: Date;
}

const DonationSchema: Schema = new Schema(
  {
    donationFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    donationTo: {
      type: Schema.Types.ObjectId,
      ref: 'WishCard',
    },
    donationPrice: {
      type: Number,
    },
    donationConfirmed: {
      type: Boolean,
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'donations',
  },
);

export const DBDonation: Model<IDBDonation> = model<IDBDonation>('DBDonation', DonationSchema);
