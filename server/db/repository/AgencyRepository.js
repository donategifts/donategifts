const Agency = require('../models/Agency');

async function getAgencyByUserId(userId) {
  try {
    return Agency.findOne({ accountManager: userId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Agency: ${error}`);
  }
}

async function getAgencyWishCards(agencyId) {
  try {
    return Agency.findOne({_id: agencyId}).populate('wishCards').exec();
  } catch (error) {
    throw new Error(`Failed to get Wishcards: ${error}`);
  }
}

async function getAgencyWishCardsByStatus(status) {
  try {
    return Agency.find({}).populate({path: 'wishCards', match: {status}}).exec();
  } catch (error) {
    throw new Error(`Failed to get Agency Wishcards: ${error}`);
  }
}

async function createNewAgency(agencyParams) {
  try {
    const newAgency = new Agency(agencyParams);
    await newAgency.save();
  } catch (error) {
    throw new Error(`Failed to create Agency: ${error}`);
  }
}

async function pushNewWishCardToAgency(id, wishCard) {
  try {
    return Agency.updateOne({ _id: id }, { $push: { wishCards: wishCard } }, { new: true }).exec();
  } catch (error) {
    throw new Error(`Failed to add wishcard to agency: ${error}`);
  }
}

module.exports = {
  getAgencyByUserId,
  getAgencyWishCards,
  getAgencyWishCardsByStatus,
  createNewAgency,
  pushNewWishCardToAgency,
};
