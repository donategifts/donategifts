const Donation = require('../models/Donation');

async function createNewDonation(params) {
  try {
    const newDonation = new Donation(params);
    return newDonation.save();
  } catch (error) {
    throw new Error(`Failed to create new Donation: ${error}`);
  }
}

async function getDonationsByUser(UserId) {
  try {
    return Donation.find({ donationFrom: UserId })
      .populate('donationCard')
      .populate('donationTo')
      .exec();
  } catch (error) {
    throw new Error(`Failed to get User's Donations: ${error}`);
  }
}

async function getDonationsByAgency(AgencyId) {
  try {
    return Donation.find({ donationTo: AgencyId })
      .populate('donationCard')
      .populate('donationFrom')
      .exec();
  } catch (error) {
    throw new Error(`Failed to get Agency's Donations: ${error}`);
  }
}

async function getDonationByWishCardId(wishCardId) {
  try {
    return Donation.findOne({ donationCard: wishCardId })
      .populate('donationCard')
      .populate('donationFrom')
      .populate('donationTo')
      .exec();
  } catch (error) {
    throw new Error(`Failed to get Agency's Donations: ${error}`);
  }
}

async function updateDonationStatus(donationId, status) {
  try {
    return Donation.findOneAndUpdate({ _id: donationId }, { $set: { status } }, { new: true })
      .lean()
      .exec();
  } catch (error) {
    throw new Error(`Failed to update donation status: ${error}`);
  }
}

module.exports = {
  createNewDonation,
  getDonationsByUser,
  getDonationsByAgency,
  getDonationByWishCardId,
  updateDonationStatus,
};
