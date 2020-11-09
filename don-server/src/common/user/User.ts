import type { Document } from 'mongoose';
import type { IDBDonation } from '../donation';
import type { TypeObjectId } from '../generic';
import type { IDBWishCard } from '../wishcard';

export enum UserRoles {
  Agency = 'agency',
  Donor = 'donor',
}

export enum LoginMode {
  Facebook = 'Facebook',
  Google = 'Google',
  Default = 'Default',
}

export interface IDBUser extends Document {
  _id: TypeObjectId<IDBUser>;
  fName: string;
  lName: string;
  email: string;
  verificationHash: string;
  emailVerified: boolean;
  password: string;
  passwordResetToken: string;
  passwordResetTokenExpires: Date;
  userRole: UserRoles;
  wishCards: TypeObjectId<IDBWishCard>;
  donationsMade: TypeObjectId<IDBDonation>;
  joined: Date;
  aboutMe: string;
  loginMode: LoginMode;
}
