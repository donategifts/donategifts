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
      ids = cardIds.map((id) => id && mongoose.Types.ObjectId(id));
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
