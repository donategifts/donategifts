import type { Document } from 'mongoose';
import type { IDBAgency } from '../agency';
import type { TypeObjectId } from '../generic';
import type { IDBMessage } from '../message';
import type { IDBUser } from '../user';

export enum WishCardStatus {
  Draft = 'draft',
  Published = 'published',
  Donated = 'donated',
}

export interface IDBWishCard extends Document {
  _id: TypeObjectId<IDBWishCard>;
  childFirstName: string;
  childLastName: string;
  childBirthday: Date;
  childInterest: string;
  wishItemName: string;
  wishItemPrice: number;
  wishItemURL: string;
  childStory: string;
  wishCardImage: string;
  createdBy: TypeObjectId<IDBUser>;
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
  isLockedBy: TypeObjectId<IDBUser>;
  isLockedUntil: Date;
  approvedByAdmin: boolean;
  messages: TypeObjectId<IDBMessage>[];
  status: WishCardStatus;
  wishCardTo: TypeObjectId<IDBAgency>;
}
