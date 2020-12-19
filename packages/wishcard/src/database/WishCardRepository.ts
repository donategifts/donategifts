import * as moment from 'moment';
import { DBWishCard } from './DBWishCard';

export class WishCardRepository {
	async createNewWishCard(wishCardParams) {
		try {
			const newCard = new DBWishCard(wishCardParams);
			return newCard.save();
		} catch (error) {
			throw new Error(`Failed to create new WishCard: ${error}`);
		}
	}

	async getAllWishCards() {
		try {
			return DBWishCard.find().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardsByItemName(itemName) {
		try {
			return DBWishCard.find({
				wishItemName: {
					$regex: itemName,
					$options: 'i',
				},
			}).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardByObjectId(cardId) {
		try {
			return DBWishCard.findOne({ _id: cardId }).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getWishCardsByStatus(status) {
		try {
			return DBWishCard.find({ status }).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getLockedWishcardsByUserId(userId) {
		try {
			return DBWishCard.findOne({ isLockedBy: userId }).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async pushNewWishCardMessage(id, message) {
		try {
			return DBWishCard.updateOne(
				{ _id: id },
				{ $push: { messages: message } },
				{ new: true },
			).exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async updateWishCardStatus(id, status) {
		try {
			return DBWishCard.updateOne({ _id: id }, { $set: { status } }).exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async lockWishCard(id, userId) {
		try {
			const wishCard = await this.getWishCardByObjectId(id);
			if (wishCard) {
				wishCard.isLockedBy = userId;
				wishCard.isLockedUntil = moment()
					.add(process.env.WISHCARD_LOCK_IN_MINUTES, 'minutes')
					.toDate();
				wishCard.save();
			}
			return wishCard;
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async unLockWishCard(id) {
		try {
			const wishCard = await this.getWishCardByObjectId(id);
			if (wishCard) {
				wishCard.isLockedBy = null;
				wishCard.isLockedUntil = null;
				wishCard.save();
				return wishCard;
			}
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}
}
