import { Schema, model, Model, Document } from '@donategifts/db-connection';
import type { IDonation, TypeObjectId, IUser, IWishCard } from '@donategifts/common';

export interface IDBDonation extends Document {
	_id: TypeObjectId<IDonation>;
	donationFrom: TypeObjectId<IUser>;
	donationTo: TypeObjectId<IWishCard>;
	donationPrice: number;
	donationConfirmed: boolean;
	donationDate: Date;
}

const donationSchema: Schema = new Schema({
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
});

export const DBDonation: Model<IDBDonation> = model<IDBDonation>('Donation', donationSchema);
