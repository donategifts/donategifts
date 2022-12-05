const moment = require('moment');
const { Types } = require('mongoose');
const WishCard = require('../models/WishCard');

class WishCardRepository {
	constructor() {
		this.wishCardModel = WishCard;
	}

	async createNewWishCard(wishCardParams) {
		try {
			return await this.wishCardModel.create(wishCardParams);
		} catch (error) {
			throw new Error(`Failed to create new WishCard: ${error}`);
		}
	}

	async getAllWishCards() {
		try {
			return await this.wishCardModel.find().lean().exec();
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

			return await this.wishCardModel.find({ $or: searchArray }).limit(25).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards: ${error}`);
		}
	}

	async getWishCardsByItemName(itemName, status) {
		try {
			return await this.wishCardModel
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

			return await this.wishCardModel.aggregate(matchPipeline).exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcards fuzzy: ${error}`);
		}
	}

	async getWishCardById(cardId) {
		try {
			return await this.wishCardModel.findOne({ _id: cardId }).populate('belongsTo').exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getWishCardsByStatus(status) {
		try {
			return await this.wishCardModel.find({ status }).populate('belongsTo').lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async getLockedWishcardsByUserId(userId) {
		try {
			return await this.wishCardModel.findOne({ isLockedBy: userId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Wishcard: ${error}`);
		}
	}

	async updateWishCard(id, wishCardFields) {
		try {
			return await this.wishCardModel
				.updateOne({ _id: id }, { $set: { ...wishCardFields } })
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to update Wishcard messages: ${error}`);
		}
	}

	async deleteWishCard(id) {
		try {
			return await this.wishCardModel.deleteOne({ _id: id }).lean().exec();
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
			return await this.wishCardModel.find({ belongsTo: agencyId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Agency's Wishcards: ${error}`);
		}
	}
}

async function createNewWishCard(wishCardParams) {
	try {
		const newCard = new WishCard(wishCardParams);
		return newCard.save();
	} catch (error) {
		throw new Error(`Failed to create new WishCard: ${error}`);
	}
}

async function getAllWishCards() {
	try {
		return WishCard.find().exec();
	} catch (error) {
		throw new Error(`Failed to get Wishcards: ${error}`);
	}
}

async function getViewableWishCards(showDonated) {
	try {
		const searchArray = [{ status: 'published' }];
		if (showDonated) {
			searchArray.push({ status: 'donated' });
		}

		return WishCard.find({ $or: searchArray }).limit(25).exec();
	} catch (error) {
		throw new Error(`Failed to get Wishcards: ${error}`);
	}
}

async function getWishCardsByItemName(itemName, status) {
	try {
		return WishCard.find({ wishItemName: { $regex: itemName, $options: 'i' }, status }).exec();
	} catch (error) {
		throw new Error(`Failed to get WishCards: ${error}`);
	}
}

async function getWishCardsFuzzy(itemName, showDonated, reverseSort, cardIds) {
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

		return WishCard.aggregate(matchPipeline).exec();
	} catch (error) {
		throw new Error(`Failed to get Wishcards fuzzy: ${error}`);
	}
}

async function getWishCardByObjectId(cardId) {
	try {
		return WishCard.findOne({ _id: cardId }).populate('belongsTo').exec();
	} catch (error) {
		throw new Error(`Failed to get Wishcard: ${error}`);
	}
}

async function getWishCardsByStatus(status) {
	try {
		return WishCard.find({ status }).populate('belongsTo').exec();
	} catch (error) {
		throw new Error(`Failed to get Wishcard: ${error}`);
	}
}

async function getLockedWishcardsByUserId(userId) {
	try {
		return WishCard.findOne({ isLockedBy: userId }).exec();
	} catch (error) {
		throw new Error(`Failed to get Wishcard: ${error}`);
	}
}

async function updateWishCard(id, wishCardFields) {
	try {
		return WishCard.updateOne({ _id: id }, { $set: { ...wishCardFields } }).exec();
	} catch (error) {
		throw new Error(`Failed to update Wishcard messages: ${error}`);
	}
}

async function deleteWishCard(id) {
	try {
		return WishCard.deleteOne({ _id: id }).exec();
	} catch (error) {
		throw new Error(`Failed to delete Wishcard message: ${error}`);
	}
}

async function lockWishCard(id, userId) {
	try {
		const wishCard = await getWishCardByObjectId(id);
		wishCard.isLockedBy = userId;
		wishCard.isLockedUntil = moment().add(process.env.WISHCARD_LOCK_IN_MINUTES, 'minutes');
		wishCard.save();
		return wishCard;
	} catch (error) {
		throw new Error(`Failed to update Wishcard messages: ${error}`);
	}
}

async function unLockWishCard(id) {
	try {
		const wishCard = await getWishCardByObjectId(id);
		wishCard.isLockedBy = null;
		wishCard.isLockedUntil = null;
		wishCard.save();
		return wishCard;
	} catch (error) {
		throw new Error(`Failed to update Wishcard messages: ${error}`);
	}
}

async function getWishCardByAgencyId(agencyId) {
	try {
		return WishCard.find({ belongsTo: agencyId }).exec();
	} catch (error) {
		throw new Error(`Failed to get Agency's Wishcards: ${error}`);
	}
}

module.exports = {
	WishCardRepository,
	createNewWishCard,
	getAllWishCards,
	getViewableWishCards,
	getWishCardsByItemName,
	getWishCardByObjectId,
	getLockedWishcardsByUserId,
	getWishCardsByStatus,
	updateWishCard,
	deleteWishCard,
	lockWishCard,
	unLockWishCard,
	getWishCardsFuzzy,
	getWishCardByAgencyId,
};
