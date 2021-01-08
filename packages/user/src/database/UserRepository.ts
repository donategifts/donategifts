// IMPORT USER MODEL
import { inject, injectable } from 'inversify';
import { IUser, TypeObjectId } from '@donategifts/common';
import { IDBUser, DBUser } from './DBUser';

@injectable()
export class UserRepository {
	constructor(@inject(DBUser) private dbUser: typeof DBUser) {}

	public async getUserById(id: TypeObjectId<IUser>): Promise<IUser> {
		return this.dbUser.findOne({ _id: id }).lean().exec();
	}

	public async updateUserById(
		id: TypeObjectId<IUser>,
		updateParams: Partial<IUser>,
	): Promise<IUser> {
		return this.dbUser.findOneAndUpdate({ _id: id }, { $set: updateParams }).exec();
	}

	public async getUserByEmail(email: string): Promise<IUser> {
		return this.dbUser.findOne({ email }).lean().exec();
	}

	public async getUserByVerificationHash(verificationHash: string): Promise<IUser> {
		return this.dbUser.findOne({ verificationHash }).lean().exec();
	}

	public async createNewUser(params: IUser): Promise<IUser> {
		return this.dbUser.create(params);
	}

	public async getUserByPasswordResetToken(tokenId: string): Promise<IUser> {
		return this.dbUser.findOne({ passwordResetToken: tokenId }).lean().exec();
	}

	public async setUserEmailVerification(
		id: TypeObjectId<IUser>,
		verified: boolean,
	): Promise<IUser> {
		return this.dbUser
			.findOneAndUpdate({ _id: id }, { $set: { emailVerified: verified } })
			.lean()
			.exec();
	}

	public async setPasswordResetToken(
		email: string,
		passwordResetToken: string,
		passwordResetTokenExpires: Date,
	): Promise<void> {
		await this.dbUser
			.updateOne({ email }, { $set: { passwordResetToken, passwordResetTokenExpires } })
			.exec();
	}

	public async updateUserPassword(hashPassword: string, token: string): Promise<void> {
		await this.dbUser
			.updateOne(
				{ passwordResetToken: token },
				{
					$set: {
						password: hashPassword,
						passwordResetToken: undefined,
						passwordResetTokenExpires: undefined,
					},
				},
			)
			.exec();
	}
}
