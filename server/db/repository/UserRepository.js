const User = require('../models/User');

module.exports = class UserRepository {
	#userModel;

	constructor() {
		this.#userModel = User;
	}

	async getUserByObjectId(id) {
		try {
			return await this.#userModel.findOne({ _id: id }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async updateUserById(id, updateParams) {
		try {
			await this.#userModel
				.updateOne({ _id: id }, { $set: { ...updateParams } })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update user: ${error}`);
		}
	}

	async getUserByEmail(email) {
		try {
			return await this.#userModel.findOne({ email }).exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async getUserByVerificationHash(verificationHash) {
		try {
			return await this.#userModel.findOne({ verificationHash }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get DB user: ${error}`);
		}
	}

	async createNewUser(params) {
		try {
			return await this.#userModel.create(params);
		} catch (error) {
			throw new Error(`Failed to create new User: ${error}`);
		}
	}

	async getUserByPasswordResetToken(tokenId) {
		try {
			return await this.#userModel.findOne({ passwordResetToken: tokenId }).exec();
		} catch (error) {
			throw new Error(`Failed to get User: ${error}`);
		}
	}

	async setUserEmailVerification(userId, verified) {
		try {
			return await this.#userModel
				.updateOne({ _id: userId }, { $set: { emailVerified: verified } })
				.exec();
		} catch (error) {
			throw new Error(`Failed to set email verification: ${error}`);
		}
	}
};
