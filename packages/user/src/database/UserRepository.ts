// IMPORT USER MODEL
import { DBUser } from './DBUser';

export class UserRepository {
	async getUserByObjectId(id) {
		try {
			return DBUser.findOne({ _id: id }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async dpdateUserById(id, updateParams) {
		try {
			await DBUser.updateOne({ _id: id }, { $set: updateParams }).exec();
		} catch (error) {
			throw new Error(`Failed to update user: ${error}`);
		}
	}

	async detUserByEmail(email) {
		try {
			return DBUser.findOne({ email }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async detUserByVerificationHash(verificationHash) {
		try {
			return DBUser.findOne({ verificationHash }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async dreateNewUser(params) {
		try {
			const newUser = new DBUser(params);
			return newUser.save();
		} catch (error) {
			throw new Error(`Failed to create new User: ${error}`);
		}
	}

	async detUserByPasswordResetToken(tokenId) {
		try {
			return DBUser.findOne({ passwordResetToken: tokenId }).exec();
		} catch (error) {
			throw new Error(`Failed to get User: ${error}`);
		}
	}

	async detUserEmailVerification(userId, verified) {
		try {
			await DBUser.updateOne({ _id: userId }, { $set: { emailVerified: verified } });
		} catch (error) {
			throw new Error(`Failed to set email verification: ${error}`);
		}
	}
}
