const moment = require('moment');
const mongoose = require('mongoose');
const WishCard = require('../models/WishCard');

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
    return WishCard.find().limit(25).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getViewableWishCards(showDonated) {
  try {
    const searchArray = [{ status: 'published' }, { status: 'draft' }];
    if (showDonated) {
      searchArray.push({ status: 'donated' });
    }

    return WishCard.find({ $or: searchArray }).limit(25).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getWishCardsByItemName(itemName, isDonated, limit) {
  try {
    return WishCard.find({ wishItemName: { $regex: itemName, $options: 'i' }, isDonated })
      .limit(limit)
      .exec();
  } catch (error) {
    throw new Error(`Failed to get WishCards: ${error}`);
  }
}

async function getWishCardsFuzzy(itemName, isDonated, limit, cardIds) {
  try {
    const match = [{ isDonated }, { isDonated: { $exists: false } }];
    let ids = [];
    if (itemName) {
      match.push(
        { wishItemName: { $regex: itemName, $options: 'i' } },
        { childStory: { $regex: itemName, $options: 'i' } },
        { childInterest: { $regex: itemName, $options: 'i' } },
        { childFirstName: { $regex: itemName, $options: 'i' } },
        { childLastName: { $regex: itemName, $options: 'i' } },
      );
    }

    if (cardIds) {
      ids = cardIds.map((id) => id && mongoose.Types.ObjectId(id));
    }

    return WishCard.aggregate([
      {
        $match: {
          _id: { $nin: ids },
          $or: match,
        },
      },
    ])
      .limit(limit)
      .exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards fuzzy: ${error}`);
  }
}

async function getWishCardByObjectId(cardId) {
  try {
    return WishCard.findOne({ _id: cardId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function getWishCardsByStatus(status) {
  try {
    return WishCard.find({ status }).exec();
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

async function pushNewWishCardMessage(id, message) {
  try {
    return WishCard.updateOne({ _id: id }, { $push: { messages: message } }, { new: true }).exec();
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

async function updateWishCard(id, wishCardFields) {
  try {
    return WishCard.updateOne({ _id: id }, { $set: { ...wishCardFields } }).exec();
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
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

module.exports = {
  createNewWishCard,
  getAllWishCards,
  getViewableWishCards,
  getWishCardsByItemName,
  getWishCardByObjectId,
  getLockedWishcardsByUserId,
  getWishCardsByStatus,
  pushNewWishCardMessage,
  updateWishCard,
  lockWishCard,
  unLockWishCard,
  getWishCardsFuzzy,
};
