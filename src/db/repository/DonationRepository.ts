import Agency from '../models/Agency';
import Donation, { STATUS } from '../models/Donation';
import User from '../models/User';
import WishCard from '../models/WishCard';

export default class DonationRepository {
	private donationModel: typeof Donation;

	constructor() {
		this.donationModel = Donation;
	}

	async createNewDonation(params: Partial<Donation>) {
		try {
			return await this.donationModel.create(params);
		} catch (error) {
			throw new Error(`Failed to create new Donation: ${error}`);
		}
	}

	async getDonationById(donationId: string) {
		try {
			return await this.donationModel
				.findOne({ _id: donationId })
				.populate<{ donationCard: WishCard }>('donationCard')
				.populate<{ donationFrom: User }>('donationFrom')
				.populate<{ donationTo: Agency }>('donationTo')
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Donation: ${error}`);
		}
	}

	async getDonationsByUser(userId: string) {
		try {
			return await this.donationModel
				.find({ donationFrom: userId })
				.populate('donationCard')
				.populate('donationTo')
				.exec();
		} catch (error) {
			throw new Error(`Failed to get User's Donations: ${error}`);
		}
	}

	async getDonationsByAgency(agencyId: string) {
		try {
			return await this.donationModel
				.find({ donationTo: agencyId })
				.populate('donationCard')
				.populate('donationFrom')
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Donations: ${error}`);
		}
	}

	async getDonationByWishCardId(wishCardId: string) {
		try {
			return await this.donationModel
				.findOne({ donationCard: wishCardId })
				.populate<{ donationCard: WishCard }>('donationCard')
				.populate<{ donationFrom: User }>('donationFrom')
				.populate<{ donationTo: Agency }>('donationTo')
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Donations: ${error}`);
		}
	}

	async updateDonationStatus(donationId: string, status: STATUS) {
		try {
			return await this.donationModel
				.findOneAndUpdate({ _id: donationId }, { $set: { status } }, { new: true })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update donation status: ${error}`);
		}
	}

	getAllDonations() {
		return this.donationModel
			.find()
			.populate<{ donationCard: WishCard }>('donationCard')
			.populate<{ donationFrom: User }>('donationFrom')
			.populate<{ donationTo: Agency }>('donationTo')
			.lean()
			.exec();
	}

	updateTrackingInfo(id: string, tracking_info: string) {
		return this.donationModel.updateOne({ _id: id }, { $set: { tracking_info } });
	}
}
