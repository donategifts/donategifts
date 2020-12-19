import { IDonation } from '../donation';
import { TypeObjectId } from '../generic';
import { IWishCard } from '../wishcard';

export enum UserRoles {
	Agency = 'agency',
	Donor = 'donor',
}

export enum LoginMode {
	Facebook = 'Facebook',
	Google = 'Google',
	Default = 'Default',
}

/** tsoaModel */
export interface IUser {
	_id: TypeObjectId<IUser>;
	fName: string;
	lName: string;
	email: string;
	verificationHash: string;
	emailVerified: boolean;
	password: string;
	passwordResetToken: string;
	passwordResetTokenExpires: Date;
	userRole: UserRoles;
	wishCards: TypeObjectId<IWishCard>;
	donationsMade: TypeObjectId<IDonation>;
	joined: Date;
	aboutMe: string;
	loginMode: LoginMode;
}
