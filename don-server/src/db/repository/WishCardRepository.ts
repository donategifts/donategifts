import * as moment from 'moment';
import { DBWishCard } from '../models/WishCard';

async function createNewWishCard(wishCardParams) {
  try {
    const newCard = new DBWishCard(wishCardParams);
    return newCard.save();
  } catch (error) {
    throw new Error(`Failed to create new WishCard: ${error}`);
  }
}

async function getAllWishCards() {
  try {
    return DBWishCard.find().exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getWishCardsByItemName(itemName) {
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

async function getWishCardByObjectId(cardId) {
  try {
    return DBWishCard.findOne({ _id: cardId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function getWishCardsByStatus(status) {
  try {
    return DBWishCard.find({ status }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function getLockedWishcardsByUserId(userId) {
  try {
    return DBWishCard.findOne({ isLockedBy: userId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function pushNewWishCardMessage(id, message) {
  try {
    return DBWishCard.updateOne({ _id: id }, { $push: { messages: message } }, { new: true }).exec();
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

async function updateWishCardStatus(id, status) {
  try {
    return DBWishCard.updateOne({ _id: id }, { $set: { status } }).exec();
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

async function lockWishCard(id, userId) {
  try {
    const wishCard = await getWishCardByObjectId(id);
    if (wishCard) {
      wishCard.isLockedBy = userId;
      wishCard.isLockedUntil = moment().add(process.env.WISHCARD_LOCK_IN_MINUTES, 'minutes').toDate();
      wishCard.save();
    }
    return wishCard;
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

async function unLockWishCard(id) {
  try {
    const wishCard = await getWishCardByObjectId(id);
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

export {
  createNewWishCard,
  getAllWishCards,
  getWishCardsByItemName,
  getWishCardByObjectId,
  getLockedWishcardsByUserId,
  getWishCardsByStatus,
  pushNewWishCardMessage,
  updateWishCardStatus,
  lockWishCard,
  unLockWishCard,
};
