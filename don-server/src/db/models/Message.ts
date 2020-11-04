import { Schema, Document, model, Model } from 'mongoose';
import { IDBWishCard } from './WishCard';
import { TypeObjectId } from '../../common/generic/ObjectId';
import { IDBUser } from './User';

export interface IDBMessage extends Document {
  messageFrom: TypeObjectId<IDBUser>;
  messageTo: TypeObjectId<IDBWishCard>;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema(
  {
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
  },
  {
    collection: 'messages',
  },
);

export const DBMessage: Model<IDBMessage> = model<IDBMessage>('DBMessage', MessageSchema);
