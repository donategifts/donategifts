const Agency = require('../models/Agency');
const { getUserByObjectId } = require('./UserRepository');

async function getAgencyByUserId(userId) {
  try {
    return Agency.findOne({ accountManager: userId }).exec();
  } catch (error) {
    throw new Error(`Failed to get Agency: ${error}`);
  }
}

async function createNewAgency(agencyParams) {
  try {
    const agency = await Agency.create(agencyParams);

    return {
      agency,
      user: await getUserByObjectId(agencyParams.accountManager),
    };
  } catch (error) {
    throw new Error(`Failed to create Agency: ${error}`);
  }
}

async function verifyAgency(agencyId) {
  try {
    return await Agency.updateOne({ id: agencyId }, { $set: { isVerified: true } }).exec();
  } catch (error) {
    throw new Error(`Failed to verify Agency: ${error}`);
  }
}

async function getVerifiedAgencies() {
  return Agency.find({ isVerified: true }).exec();
}

module.exports = {
  getAgencyByUserId,
  createNewAgency,
  getVerifiedAgencies,
  verifyAgency,
};
