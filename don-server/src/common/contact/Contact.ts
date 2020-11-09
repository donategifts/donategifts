import type { Document } from 'mongoose';
import type { TypeObjectId } from '../generic';

export interface IDBContact extends Document {
  _id: TypeObjectId<IDBContact>;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentDate: Date;
}
