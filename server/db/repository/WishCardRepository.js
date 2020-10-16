const WishCard = require('../models/WishCard');

async function createNewWishCard(wishCardParams) {
  try {
    const newCard = new WishCard(wishCardParams);
    await newCard.save();
  } catch (error) {
    throw new Error(`Failed to create new WishCard: ${error}`);
  }
}

async function getAllWishCards() {
  try {
    return WishCard.find();
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
    });
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getWishCardByObjectId(cardId) {
  try {
    return WishCard.findOne({ _id: cardId });
  } catch (error) {
    throw new Error(`Failed to get Wishcard: ${error}`);
  }
}

async function pushNewWishCardMessage(id, message) {
  try {
    return WishCard.updateOne({ _id: id }, { $push: { messages: message } }, { new: true });
  } catch (error) {
    throw new Error(`Failed to update Wishcard messages: ${error}`);
  }
}

module.exports = {
  createNewWishCard,
  getAllWishCards,
  getWishCardsByItemName,
  getWishCardByObjectId,
  pushNewWishCardMessage,
};
