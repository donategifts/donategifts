import { Schema, model, Model } from 'mongoose';
import type { IDBContact } from '../../common';

const ContactSchema: Schema = new Schema(
  {
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
  },
  {
    collection: 'contacts',
  },
);

export const DBContact: Model<IDBContact> = model<IDBContact>('DBContact', ContactSchema);
