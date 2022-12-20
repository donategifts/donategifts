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
    return await Agency.findOneAndUpdate(
      { _id: agencyId },
      { $set: { isVerified: true } },
      { new: true },
    )
      .populate('accountManager')
      .lean()
      .exec();
  } catch (error) {
    throw new Error(`Failed to verify Agency: ${error}`);
  }
}

async function getVerifiedAgencies() {
  return Agency.find({ isVerified: true }).exec();
}

async function getUnverifiedAgencies() {
  return Agency.find({ isVerified: false }).exec();
}

async function getAgencyByName(name) {
  try {
    return await Agency.findOne({ agencyName: name }).populate('accountManager').lean().exec();
  } catch (error) {
    throw new Error('Failed to get agency by name: ', error);
  }
}

module.exports = {
  getAgencyByUserId,
  createNewAgency,
  getVerifiedAgencies,
  verifyAgency,
  getUnverifiedAgencies,
  getAgencyByName,
};
