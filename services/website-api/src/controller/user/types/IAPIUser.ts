import { LoginMode, UserRoles } from '@donategifts/common';

export interface IAPIUser {
	_id: string;
	fName: string;
	lName: string;
	email: string;
	verificationHash: string;
	emailVerified: boolean;
	password: string;
	passwordResetToken?: string;
	passwordResetTokenExpires?: Date;
	userRole: UserRoles;
	joined: Date;
	aboutMe?: string;
	loginMode: LoginMode;
	profileImage?: string;
}
