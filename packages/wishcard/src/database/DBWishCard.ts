import { Schema, model, Model, Document } from '@donategifts/db-connection';
import type {
	IWishCard,
	IAgency,
	IMessage,
	IUser,
	TypeObjectId,
	WishCardStatus,
} from '@donategifts/common';

export interface IDBWishCard extends Document {
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
	belongsTo: TypeObjectId<IAgency>;
}

const wishCardSchema: Schema = new Schema({
	childFirstName: {
		type: String,
	},
	childLastName: {
		type: String,
	},
	childBirthday: {
		type: Date,
	},
	childInterest: {
		type: String,
	},
	wishItemName: {
		type: String,
	},
	wishItemPrice: {
		type: Number,
	},
	wishItemURL: {
		type: String,
	},
	childStory: {
		type: String,
	},
	wishCardImage: {
		type: String,
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	deliveryDate: {
		type: Date,
	},
	occasion: {
		type: String,
	},
	address: {
		address1: { type: String },
		address2: { type: String },
		city: { type: String },
		state: { type: String },
		country: { type: String },
		zipcode: { type: String },
	},
	isDonated: {
		type: Boolean,
		default: false,
	},
	isLockedBy: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	isLockedUntil: {
		type: Date,
	},
	approvedByAdmin: {
		type: Boolean,
		default: false,
	},
	messages: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Message',
		},
	],
	status: {
		type: String,
		enum: ['draft', 'published', 'donated'],
		default: 'draft',
	},
	belongsTo: {
		type: Schema.Types.ObjectId,
		ref: 'Agency',
	},
});

export const DBWishCard: Model<IDBWishCard> = model<IDBWishCard>('DBWishCard', wishCardSchema);
