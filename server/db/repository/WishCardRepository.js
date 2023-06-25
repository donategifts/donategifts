const moment = require('moment');
const { Types } = require('mongoose');
const WishCard = require('../models/WishCard');
const UserRepository = require('./UserRepository');
const Messaging = require('../../helper/messaging');
const DonationRepository = require('./DonationRepository');

module.exports = class WishCardRepository {
	#wishCardModel;

	#wishCardChangeListener;

	#userRepository;

	#donationRepository;

	constructor() {
		this.#wishCardModel = WishCard;

		this.#userRepository = new UserRepository();

		this.#donationRepository = new DonationRepository();

		if (!this.#wishCardChangeListener && process.env.NODE_ENV === 'production') {
			this.#wishCardChangeListener = this.#wishCardModel.watch();
		}
	}

	async createNewWishCard(wishCardParams) {
		try {
			return await this.#wishCardModel.create(wishCardParams);
		} catch (error) {
			throw new Error(`Failed to create new WishCard: ${error}`);
		}
	}

	async getAllWishCards() {
		try {
			return await this.#wishCardModel.find().lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getViewableWishCards(showDonated) {
		try {
			const searchArray = [{ status: 'published' }];

			if (showDonated) {
				searchArray.push({ status: 'donated' });
			}

			return await this.#wishCardModel.find({ $or: searchArray }).limit(25).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardsByItemName(itemName, status) {
		try {
			return await this.#wishCardModel
				.find({
					wishItemName: { $regex: itemName, $options: 'i' },
					status,
				})
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get WishCards: ${error}`);
		}
	}

	async getWishCardsFuzzy(itemName, showDonated, reverseSort, cardIds) {
		try {
			const searchMatch = [];
			const statusMatch = [{ status: 'published' }];
			if (showDonated) {
				statusMatch.push({ status: 'donated' });
			}
			let ids = [];
			if (itemName) {
				searchMatch.push(
					{ wishItemName: { $regex: itemName, $options: 'i' } },
					{ childStory: { $regex: itemName, $options: 'i' } },
					{ childInterest: { $regex: itemName, $options: 'i' } },
					{ childFirstName: { $regex: itemName, $options: 'i' } },
					{ childLastName: { $regex: itemName, $options: 'i' } },
				);
			}

			if (cardIds) {
				ids = cardIds.map((id) => id && Types.ObjectId(id));
			}

			let sortOrder = 1;
			if (reverseSort) {
				sortOrder = -1;
			}

			const matchPipeline = [
				{
					$match: {
						_id: { $nin: ids },
						$or: statusMatch,
					},
				},
				{
					$sort: {
						status: -1,
						createdAt: sortOrder,
					},
				},
			];

			if (itemName) {
				matchPipeline.unshift({
					$match: {
						_id: { $nin: ids },
						$or: searchMatch,
					},
				});
			}

			return await this.#wishCardModel.aggregate(matchPipeline).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards fuzzy: ${error}`);
		}
	}

	async getWishCardById(cardId) {
		try {
			return await this.#wishCardModel.findOne({ _id: cardId }).populate('belongsTo').exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getWishCardsByStatus(status) {
		try {
			return await this.#wishCardModel.find({ status }).populate('belongsTo').lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getLockedWishcardsByUserId(userId) {
		try {
			return await this.#wishCardModel.findOne({ isLockedBy: userId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async updateWishCard(id, wishCardFields) {
		try {
			return await this.#wishCardModel
				.updateOne({ _id: id }, { $set: { ...wishCardFields } })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async deleteWishCard(id) {
		try {
			return await this.#wishCardModel.deleteOne({ _id: id }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to delete Wishcard message: ${error}`);
		}
	}

	async lockWishCard(id, userId) {
		try {
			const wishCard = await this.getWishCardById(id);
			wishCard.isLockedBy = userId;
			wishCard.isLockedUntil = moment().add(process.env.WISHCARD_LOCK_IN_MINUTES, 'minutes');
			wishCard.save();
			return wishCard;
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async unLockWishCard(id) {
		try {
			const wishCard = await this.getWishCardById(id);
			wishCard.isLockedBy = null;
			wishCard.isLockedUntil = null;
			wishCard.save();
			return wishCard;
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async getWishCardByAgencyId(agencyId) {
		try {
			return await this.#wishCardModel.find({ belongsTo: agencyId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Wishcards: ${error}`);
		}
	}

	async getWishCardByObjectId(cardId) {
		try {
			return WishCard.findOne({ _id: cardId }).populate('belongsTo').exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	#hasWishcardStatusChangedTo(change, status) {
		return (
			change &&
			change.operationType === 'update' &&
			change.updateDescription &&
			change.updateDescription.updatedFields &&
			change.updateDescription.updatedFields.status &&
			change.updateDescription.updatedFields.status === status
		);
	}

	#wishcardIsOrdered(change) {
		return this.#hasWishcardStatusChangedTo(change, 'ordered');
	}

	#wishcardIsPublished(change) {
		return this.#hasWishcardStatusChangedTo(change, 'published');
	}

	async #handleDonationOrdered(change) {
		const wishCard = await this.getWishCardByObjectId(change.documentKey._id);
		const agency = wishCard.belongsTo;
		const accountManager = await this.#userRepository.getUserByObjectId(agency.accountManager);
		const donation = await this.#donationRepository.getDonationByWishCardId(wishCard._id);

		await this.#donationRepository.updateDonationStatus(donation._id, 'ordered');
		await Messaging.sendDonationOrderedEmail({
			agencyEmail: accountManager.email,
			agencyName: agency.agencyName,
			childName: wishCard.childFirstName,
			itemName: wishCard.wishItemName,
			itemPrice: wishCard.wishItemPrice,
			donationDate: moment(new Date(donation.donationDate)).format('MMM Do, YYYY'),
			address: `${agency.agencyAddress.address1} ${agency.agencyAddress.city} ${agency.agencyAddress.zipcode} ${agency.agencyAddress.state}`,
		});
	}

	async #handleWishcardPublished() {
		// TODO
		return undefined;
	}

	watch() {
		this.#wishCardChangeListener.on('change', async (change) => {
			if (this.#wishcardIsOrdered(change)) {
				await this.#handleDonationOrdered(change);
			} else if (this.#wishcardIsPublished(change)) {
				await this.#handleWishcardPublished();
			}
		});
	}
};
