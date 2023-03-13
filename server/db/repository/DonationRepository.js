const Donation = require('../models/Donation');

module.exports = class DonationRepository {
	#donationModel;

	constructor() {
		this.#donationModel = Donation;
	}

	async createNewDonation(params) {
		try {
			return await this.#donationModel.create(params);
		} catch (error) {
			throw new Error(`Failed to create new Donation: ${error}`);
		}
	}

	async getDonationsByUser(UserId) {
		try {
			return await this.#donationModel
				.find({ donationFrom: UserId })
				.populate('donationCard')
				.populate('donationTo')
				.exec();
		} catch (error) {
			throw new Error(`Failed to get User's Donations: ${error}`);
		}
	}

	async getDonationsByAgency(AgencyId) {
		try {
			return await this.#donationModel
				.find({ donationTo: AgencyId })
				.populate('donationCard')
				.populate('donationFrom')
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Donations: ${error}`);
		}
	}

	async getDonationByWishCardId(wishCardId) {
		try {
			return await this.#donationModel
				.findOne({ donationCard: wishCardId })
				.populate('donationCard')
				.populate('donationFrom')
				.populate('donationTo')
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Donations: ${error}`);
		}
	}

	async updateDonationStatus(donationId, status) {
		try {
			return await this.#donationModel
				.findOneAndUpdate({ _id: donationId }, { $set: { status } }, { new: true })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update donation status: ${error}`);
		}
	}
};
