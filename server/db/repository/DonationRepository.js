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
    return Donation.find({ donationFrom: UserId }).populate('donationCard').populate('donationTo').exec();
  } catch (error) {
    throw new Error(`Failed to get User's Donations: ${error}`);
  }
}

async function getDonationsByAgency(AgencyId) {
  try {
    return Donation.find({ donationTo: AgencyId }).populate('donationCard').populate('donationFrom').exec();
  } catch (error) {
    throw new Error(`Failed to get Agency's Donations: ${error}`);
  }
}

module.exports = {
  createNewDonation,
  getDonationsByUser,
  getDonationsByAgency,
};
