const Agency = require('../models/Agency');

async function getAgencyByUserId(userId) {
  try {
    return Agency.findOne({ accountManager: userId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Agency: ${error}`);
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

async function getVerifiedAgencies() {
  return Agency.find({ isVerified: true }).exec();
}

module.exports = {
  getAgencyByUserId,
  createNewAgency,
  getVerifiedAgencies

};
