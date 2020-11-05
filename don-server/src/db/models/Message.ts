import { Schema, model, Model } from 'mongoose';
import { IDBMessage } from '../../common';

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
