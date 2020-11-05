import { Schema, model, Model } from 'mongoose';
import type { IDBDonation } from '../../common';

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
