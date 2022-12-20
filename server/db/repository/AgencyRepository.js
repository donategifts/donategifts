const Agency = require('../models/Agency');
const { getUserByObjectId, UserRepository } = require('./UserRepository');

class AgencyRepository {
	#agencyModel;

	#userRepository;

	constructor() {
		this.#agencyModel = Agency;
		this.#userRepository = new UserRepository();
	}

	async getAgencyByUserId(userId) {
		try {
			return this.#agencyModel.findOne({ accountManager: userId }).exec();
		} catch (error) {
			throw new Error(`Failed to get Agency: ${error}`);
		}
	}

	async createNewAgency(agencyParams) {
		try {
			const agency = await this.#agencyModel.create(agencyParams);

			return {
				agency,
				user: await this.#userRepository.getUserByObjectId(agencyParams.accountManager),
			};
		} catch (error) {
			throw new Error(`Failed to create Agency: ${error}`);
		}
	}

	async verifyAgency(agencyId) {
		try {
			return this.#agencyModel
				.findOneAndUpdate({ _id: agencyId }, { $set: { isVerified: true } }, { new: true })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to verify Agency: ${error}`);
		}
	}

	async getVerifiedAgencies() {
		return this.#agencyModel.find({ isVerified: true }).exec();
	}

	async getUnverifiedAgencies() {
		return this.#agencyModel.find({ isVerified: false }).exec();
	}
}

async function getAgencyByUserId(userId) {
	try {
		return Agency.findOne({ accountManager: userId }).exec();
	} catch (error) {
		throw new Error(`Failed to get Agency: ${error}`);
	}
}

async function createNewAgency(agencyParams) {
	try {
		const agency = await Agency.create(agencyParams);

		return {
			agency,
			user: await getUserByObjectId(agencyParams.accountManager),
		};
	} catch (error) {
		throw new Error(`Failed to create Agency: ${error}`);
	}
}

async function verifyAgency(agencyId) {
	try {
		return Agency.findOneAndUpdate(
			{ _id: agencyId },
			{ $set: { isVerified: true } },
			{ new: true },
		)
			.lean()
			.exec();
	} catch (error) {
		throw new Error(`Failed to verify Agency: ${error}`);
	}
}

async function getVerifiedAgencies() {
	return Agency.find({ isVerified: true }).exec();
}

async function getUnverifiedAgencies() {
	return Agency.find({ isVerified: false }).exec();
}

async function getAgencyByName(name) {
	try {
		return await Agency.findOne({ agencyName: name }).populate('accountManager').lean().exec();
	} catch (error) {
		throw new Error('Failed to get agency by name: ', error);
	}
}

module.exports = {
	AgencyRepository,
	getAgencyByUserId,
	createNewAgency,
	getVerifiedAgencies,
	verifyAgency,
	getUnverifiedAgencies,
	getAgencyByName,
};
