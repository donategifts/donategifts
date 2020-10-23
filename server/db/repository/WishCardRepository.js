const moment = require('moment');
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
    return WishCard.find().exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getWishCardsByItemName(itemName) {
  try {
    return WishCard.find({
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
    return WishCard.findOne({ _id: cardId }).exec();
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

async function lockWishCard(id, userId) {
  try {
    const wishCard = await getWishCardByObjectId(id).exec();
    wishCard.isLockedBy = userId;
    wishCard.isLockedUntil = moment().add(1, 'minutes');
    wishCard.save();
    return wishCard;
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

module.exports = {
  createNewWishCard,
  getAllWishCards,
  getWishCardsByItemName,
  getWishCardByObjectId,
  getLockedWishcardsByUserId,
  pushNewWishCardMessage,
  lockWishCard,
};
