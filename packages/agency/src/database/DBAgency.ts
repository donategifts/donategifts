import { Document, model, Model, Schema } from '@donategifts/db-connection';
import type { TypeObjectId, IUser, IWishCard, IAgency } from '@donategifts/common';

export interface IDBAgency extends Document {
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

// SCHEMA SETUP
const agencySchema: Schema = new Schema({
	agencyName: {
		type: String,
	},
	agencyWebsite: {
		type: String,
	},
	agencyPhone: {
		type: String,
	},
	accountManager: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	agencyBio: {
		type: String,
	},
	agencyAddress: {
		address1: { type: String },
		address2: { type: String },
		city: { type: String },
		state: { type: String },
		country: { type: String },
		zipcode: { type: String },
	},
	childrenUnderCare: {
		type: Number,
	},
	childrenAgeRange: {
		type: String,
	},
	agencyProfileImage: {
		type: String,
	},
	wishCards: [
		{
			type: Schema.Types.ObjectId,
			ref: 'WishCard',
		},
	],
	joinedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	joined: {
		type: Date,
		default: Date.now,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
});

export const DBAgency: Model<IDBAgency> = model<IDBAgency>('Agencies', agencySchema);
