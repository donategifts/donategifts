const Donation = require('../models/Donation');


async function createNewDonation(params) {
  try {
    const newDonation = new Donation(params);
    return newDonation.save();
  } catch (error) {
    throw new Error(`Failed to create new Donation: ${error}`);
  }
}

async function getDonationByWishCardId(wishCardId) {
  try {
    return Donation.findOne({ donationTo: wishCardId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Donation: ${error}`);
  }
}

module.exports = {
  createNewDonation,
  getDonationByWishCardId
};
