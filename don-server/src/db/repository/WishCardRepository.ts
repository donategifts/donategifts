import moment from 'moment';
import WishCard, { find, findOne, updateOne } from '../models/WishCard';

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
    return find().exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getWishCardsByItemName(itemName) {
  try {
    return find({
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
    return findOne({ _id: cardId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function getWishCardsByStatus(status) {
  try {
    return find({ status }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function getLockedWishcardsByUserId(userId) {
  try {
    return findOne({ isLockedBy: userId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function pushNewWishCardMessage(id, message) {
  try {
    return updateOne({ _id: id }, { $push: { messages: message } }, { new: true }).exec();
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

async function updateWishCardStatus(id, status) {
  try {
    return updateOne({ _id: id }, { $set: { status } }).exec();
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
