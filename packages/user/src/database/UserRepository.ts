// IMPORT USER MODEL
import { inject, injectable } from 'inversify';
import { DBUser } from './DBUser';

// TODO: needs typing!!
@injectable()
export class UserRepository {
	constructor(@inject(DBUser) private dbUser: typeof DBUser) {}

	async getUserByObjectId(id) {
		try {
			return this.dbUser.findOne({ _id: id }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async dpdateUserById(id, updateParams) {
		try {
			await this.dbUser.updateOne({ _id: id }, { $set: updateParams }).exec();
		} catch (error) {
			throw new Error(`Failed to update user: ${error}`);
		}
	}

	async detUserByEmail(email) {
		try {
			return this.dbUser.findOne({ email }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async detUserByVerificationHash(verificationHash) {
		try {
			return this.dbUser.findOne({ verificationHash }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async dreateNewUser(params) {
		try {
			return this.dbUser.create(params);
		} catch (error) {
			throw new Error(`Failed to create new User: ${error}`);
		}
	}

	async detUserByPasswordResetToken(tokenId) {
		try {
			return this.dbUser.findOne({ passwordResetToken: tokenId }).exec();
		} catch (error) {
			throw new Error(`Failed to get User: ${error}`);
		}
	}

	async detUserEmailVerification(userId, verified) {
		try {
			await this.dbUser.updateOne({ _id: userId }, { $set: { emailVerified: verified } }).exec();
		} catch (error) {
			throw new Error(`Failed to set email verification: ${error}`);
		}
	}
}
