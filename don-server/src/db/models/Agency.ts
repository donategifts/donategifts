import { Schema, Document, model, Model } from 'mongoose';
import { IDBWishCard } from './WishCard';
import { TypeObjectId } from '../../common/generic/ObjectId';
import { IDBUser } from './User';

export interface IDBAgency extends Document {
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

// SCHEMA SETUP
const AgencySchema: Schema = new Schema(
  {
    agencyName: {
      type: String,
    },
    agencyWebsite: {
      type: String,
    },
    agencyPhone: {
      type: String,
    },
    accountManager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    agencyBio: {
      type: String,
    },
    agencyAddress: {
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipcode: { type: String },
    },
    childrenUnderCare: {
      type: Number,
    },
    childrenAgeRange: {
      type: String,
    },
    agencyProfileImage: {
      type: String,
    },
    wishCards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WishCard',
      },
    ],
    joinedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    joined: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'agencies',
  },
);

export const DBAgency: Model<IDBAgency> = model<IDBAgency>('DBAgency', AgencySchema);
