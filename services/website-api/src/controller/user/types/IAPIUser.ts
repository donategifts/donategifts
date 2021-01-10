import { LoginMode, UserRoles } from '@donategifts/common';

export interface IUserUpdateParams {
	fName?: string;
	lName?: string;
	email?: string;
	aboutMe?: string;
	profileImage?: Express.Multer.File;
}

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
