import { Schema, model, Model, Document } from '@donategifts/db-connection';
import type { IMessage, IUser, IWishCard, TypeObjectId } from '@donategifts/common';

export interface IDBMessage extends Document {
	_id: TypeObjectId<IMessage>;
	messageFrom: TypeObjectId<IUser>;
	messageTo: TypeObjectId<IWishCard>;
	message: string;
	createdAt: Date;
}

const MessageSchema = new Schema({
	messageFrom: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	messageTo: {
		type: Schema.Types.ObjectId,
		ref: 'WishCard',
	},
	message: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

export const DBMessage: Model<IDBMessage> = model<IDBMessage>('Messages', MessageSchema);
