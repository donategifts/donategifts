import type { Document } from 'mongoose';
import type { TypeObjectId } from '../generic';
import type { IDBUser } from '../user';
import type { IDBWishCard } from '../wishcard';

export interface IDBMessage extends Document {
  _id: TypeObjectId<IDBMessage>;
  messageFrom: TypeObjectId<IDBUser>;
  messageTo: TypeObjectId<IDBWishCard>;
  message: string;
  createdAt: Date;
}
