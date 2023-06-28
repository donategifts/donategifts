const Agency = require('../models/Agency');
const UserRepository = require('./UserRepository');

module.exports = class AgencyRepository {
	#agencyModel;

	#userRepository;

	constructor() {
		this.#agencyModel = Agency;
		this.#userRepository = new UserRepository();
	}

	async getAgencyByUserId(userId) {
		try {
			return this.#agencyModel.findOne({ accountManager: userId }).lean().exec();
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
};
