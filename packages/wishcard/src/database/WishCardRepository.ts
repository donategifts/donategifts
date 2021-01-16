import { inject, injectable } from 'inversify';
import * as moment from 'moment';
import { IAgency, IWishCard, TypeObjectId } from '@donategifts/common';
import { DBWishCard } from './DBWishCard';

// TODO: needs typing!!
@injectable()
export class WishCardRepository {
	constructor(@inject(DBWishCard) private dbWishCard: typeof DBWishCard) {}

	async createNewWishCard(wishCardParams) {
		try {
			return this.dbWishCard.create(wishCardParams);
		} catch (error) {
			throw new Error(`Failed to create new WishCard: ${error}`);
		}
	}

	async getAllWishCards() {
		try {
			return this.dbWishCard.find().lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardsByItemName(itemName) {
		try {
			return this.dbWishCard
				.find({
					wishItemName: {
						$regex: itemName,
						$options: 'i',
					},
				})
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardByObjectId(cardId: TypeObjectId<IWishCard>): Promise<IWishCard> {
		try {
			return this.dbWishCard.findOne({ _id: cardId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getWishCardsByStatus(status) {
		try {
			return this.dbWishCard.find({ status }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getLockedWishcardsByUserId(userId) {
		try {
			return this.dbWishCard.findOne({ isLockedBy: userId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async pushNewWishCardMessage(id, message) {
		try {
			return this.dbWishCard
				.updateOne({ _id: id }, { $push: { messages: message } }, { new: true })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async updateWishCardStatus(id: TypeObjectId<IWishCard>, status): Promise<IWishCard> {
		try {
			return this.dbWishCard.updateOne({ _id: id }, { $set: { status } }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async lockWishCard(id, userId) {
		try {
			const wishCard = await this.dbWishCard.findById(id);
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
			const wishCard = await this.dbWishCard.findById(id);
			if (wishCard) {
				wishCard.isLockedBy = null;
				wishCard.isLockedUntil = null;
				wishCard.save();
				return wishCard;
			}

			return null;
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async getWishCardsByAgencyId(id: TypeObjectId<IAgency>): Promise<IWishCard[]> {
		try {
			return this.dbWishCard.find({ belongsTo: id }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards for Agency ${id}: ${error}`);
		}
	}
}
