import mongoose from 'mongoose';

interface User {
	_id: string;
	fName: string;
	lName: string;
	email: string;
	verificationHash: string;
	emailVerified: boolean;
	password: string;
	passwordResetToken: string | null;
	passwordResetTokenExpires: Date | null;
	userRole: string;
	joined: Date;
	aboutMe: string;
	loginMode: string;
	profileImage: string;
}

const { Schema } = mongoose;
const UserSchema = new Schema(
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
	},
	{
		collection: 'users',
	},
);

const User = mongoose.model<User>('User', UserSchema);

export default User;
