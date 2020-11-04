import { Schema, Document, model, Model } from 'mongoose';

export interface IDBContact extends Document {
  name: string;
  email: string;
  subject: string;
  message: string;
  sentDate: Date;
}

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
