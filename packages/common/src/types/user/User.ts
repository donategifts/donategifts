import type { IDonation } from '../donation';
import type { TypeObjectId } from '../generic';
import type { IWishCard } from '../wishcard';

export enum UserRoles {
	Agency = 'agency',
	Donor = 'donor',
	Partner = 'partner',
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
