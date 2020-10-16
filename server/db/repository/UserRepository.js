// IMPORT USER MODEL
const User = require('../models/User');

async function getUserByObjectId(id) {
  try {
    return User.findOne({ _id: id });
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function updateUserById(id, updateParams) {
  try {
    await User.updateOne({ _id: id }, { $set: { updateParams } });
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`);
  }
}

async function getUserByEmail(email) {
  try {
    return User.findOne({ email });
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function getUserByVerificationHash(verificationHash) {
  try {
    return User.findOne({ verificationHash });
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function createNewUser(params) {
  try {
    const newUser = new User(params);
    await newUser.save();

    return newUser;
  } catch (error) {
    throw new Error(`Failed to create new User: ${error}`);
  }
}

module.exports = {
  getUserByObjectId,
  updateUserById,
  getUserByEmail,
  getUserByVerificationHash,
  createNewUser,
};
