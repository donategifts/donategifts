// IMPORT USER MODEL
import { inject, injectable } from 'inversify';
import { IUser, TypeObjectId } from '@donategifts/common';
import { DBUser } from './DBUser';

@injectable()
export class UserRepository {
	constructor(@inject(DBUser) private dbUser: typeof DBUser) {}

	async getUserByObjectId(id: TypeObjectId<IUser>): Promise<IUser> {
		try {
			return this.dbUser.findOne({ _id: id }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async updateUserById(id: TypeObjectId<IUser>, updateParams: Partial<IUser>): Promise<void> {
		try {
			await this.dbUser.updateOne({ _id: id }, { $set: updateParams }).exec();
		} catch (error) {
			throw new Error(`Failed to update user: ${error}`);
		}
	}

	async getUserByEmail(email: string): Promise<IUser> {
		try {
			return this.dbUser.findOne({ email }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async getUserByVerificationHash(verificationHash: string): Promise<IUser> {
		try {
			return this.dbUser.findOne({ verificationHash }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async createNewUser(params: IUser): Promise<IUser> {
		try {
			return this.dbUser.create(params);
		} catch (error) {
			throw new Error(`Failed to create new User: ${error}`);
		}
	}

	async getUserByPasswordResetToken(tokenId: string): Promise<IUser> {
		try {
			return this.dbUser.findOne({ passwordResetToken: tokenId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get User: ${error}`);
		}
	}

	async detUserEmailVerification(id: TypeObjectId<IUser>, verified: boolean): Promise<void> {
		try {
			await this.dbUser.updateOne({ _id: id }, { $set: { emailVerified: verified } }).exec();
		} catch (error) {
			throw new Error(`Failed to set email verification: ${error}`);
		}
	}
}
