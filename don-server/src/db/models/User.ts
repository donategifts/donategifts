import { Schema, model, Model } from 'mongoose';
import { IDBUser } from '../../common';

const UserSchema: Schema = new Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verificationHash: {
      type: String,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    userRole: String,
    /* ROLES: Donor, Partner, Admin */
    /* IF THE USER IS PARTNER OR ADMIN, THEY CAN CREATE WISH CARDS */
    wishCards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WishCard',
      },
    ],
    donationsMade: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Donation',
      },
    ],
    joined: {
      type: Date,
      default: Date.now,
    },
    aboutMe: {
      type: String,
      required: false,
    },
    /** Facebook | Google | Default */
    loginMode: {
      type: String,
      required: false,
    },
  },
  {
    collection: 'users',
  },
);

export const DBUser: Model<IDBUser> = model<IDBUser>('DBUser', UserSchema);
