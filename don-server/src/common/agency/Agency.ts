import { Document } from 'mongoose';
import type { TypeObjectId } from '../generic';
import type { IDBUser } from '../user';
import type { IDBWishCard } from '../wishcard';

export interface IDBAgency extends Document {
  _id: TypeObjectId<IDBAgency>;
  agencyName: string;
  agencyWebsite: string;
  agencyPhone: string;
  accountManager: TypeObjectId<IDBUser>;
  agencyBio: string;
  agencyAddress: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    country: string;
    zipcode: string;
  };
  childrenUnderCare: number;
  childrenAgeRange: string;
  agencyProfileImage: string;
  wishCards: TypeObjectId<IDBWishCard>[];
  joinedBy: TypeObjectId<IDBUser>;
  joined: Date;
  isVerified: boolean;
}
