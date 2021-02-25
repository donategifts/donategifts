import { Schema, model, Model, Document } from '@donategifts/db-connection';
import type { IUser, TypeObjectId, UserRoles, LoginMode } from '@donategifts/common';

export interface IDBUser extends Document {
	_id: TypeObjectId<IUser>;
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

const userSchema: Schema = new Schema({
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
	userRole: {
		type: String,
		enum: ['donor', 'partner', 'admin'],
	},
	/* ROLES: Donor, Partner, Admin */
	/* IF THE USER IS PARTNER OR ADMIN, THEY CAN CREATE WISH CARDS */
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
	profileImage: {
		type: String,
	},
});

export const DBUser: Model<IDBUser> = model<IDBUser>('Users', userSchema);
