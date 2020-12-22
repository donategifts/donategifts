import { Schema, model, Model, Document } from '@donategifts/db-connection';
import type { IContact, TypeObjectId } from '@donategifts/common';

export interface IDBContact extends Document {
	_id: TypeObjectId<IContact>;
	name: string;
	email: string;
	subject: string;
	message: string;
	sentDate: Date;
}

const contactSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	subject: {
		type: String,
		required: true,
	},
	message: {
		type: String,
		required: true,
	},
	sentDate: {
		type: Date,
		default: Date.now,
	},
});

export const DBContact: Model<IDBContact> = model<IDBContact>('DBContact', contactSchema);
