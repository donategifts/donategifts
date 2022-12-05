const User = require('../models/User');

class UserRepository {
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
			await this.#userModel.updateOne({ _id: id }, { $set: updateParams }).exec();
		} catch (error) {
			throw new Error(`Failed to update user: ${error}`);
		}
	}

	async getUserByEmail(email) {
		try {
			return await this.#userModel.findOne({ email }).lean().exec();
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
			return await this.#userModel.findOne({ passwordResetToken: tokenId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get User: ${error}`);
		}
	}

	async setUserEmailVerification(userId, verified) {
		try {
			await this.#userModel
				.updateOne({ _id: userId }, { $set: { emailVerified: verified } })
				.exec();
		} catch (error) {
			throw new Error(`Failed to set email verification: ${error}`);
		}
	}
}

async function getUserByObjectId(id) {
	try {
		return User.findOne({ _id: id }).exec();
	} catch (error) {
		throw new Error(`Failed to get DB user: ${error}`);
	}
}

async function updateUserById(id, updateParams) {
	try {
		await User.updateOne({ _id: id }, { $set: updateParams }).exec();
	} catch (error) {
		throw new Error(`Failed to update user: ${error}`);
	}
}

async function getUserByEmail(email) {
	try {
		return User.findOne({ email }).exec();
	} catch (error) {
		throw new Error(`Failed to get DB user: ${error}`);
	}
}

async function getUserByVerificationHash(verificationHash) {
	try {
		return User.findOne({ verificationHash }).exec();
	} catch (error) {
		throw new Error(`Failed to get DB user: ${error}`);
	}
}

async function createNewUser(params) {
	try {
		const newUser = new User(params);
		return newUser.save();
	} catch (error) {
		throw new Error(`Failed to create new User: ${error}`);
	}
}

async function getUserByPasswordResetToken(tokenId) {
	try {
		return User.findOne({ passwordResetToken: tokenId }).exec();
	} catch (error) {
		throw new Error(`Failed to get User: ${error}`);
	}
}

async function setUserEmailVerification(userId, verified) {
	try {
		await User.updateOne({ _id: userId }, { $set: { emailVerified: verified } });
	} catch (error) {
		throw new Error(`Failed to set email verification: ${error}`);
	}
}

module.exports = {
	UserRepository,
	getUserByObjectId,
	updateUserById,
	getUserByEmail,
	getUserByVerificationHash,
	createNewUser,
	getUserByPasswordResetToken,
	setUserEmailVerification,
};
