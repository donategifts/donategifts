// IMPORT USER MODEL
const User = require('../models/User');

async function getUserByObjectId(id) {
  try {
    return User.findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function updateUserById(id, updateParams) {
  try {
    await User.updateOne({ _id: id }, { $set: updateParams }).exec();
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`);
  }
}

async function getUserByEmail(email) {
  try {
    return User.findOne({ email }).exec();
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function getUserByVerificationHash(verificationHash) {
  try {
    return User.findOne({ verificationHash }).exec();
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function createNewUser(params) {
  try {
    const newUser = new User(params);
    return newUser.save();
  } catch (error) {
    throw new Error(`Failed to create new User: ${error}`);
  }
}

async function getUserByPasswordResetToken(tokenId) {
  try {
    return User.findOne({ passwordResetToken: tokenId }).exec();
  } catch (error) {
    throw new Error(`Failed to get User: ${error}`);
  }
}

async function setUserEmailVerification(userId, verified) {
  try {
    await User.updateOne({ _id: userId }, { $set: { emailVerified: verified } });
  } catch (error) {
    throw new Error(`Failed to set email verification: ${error}`);
  }
}

module.exports = {
  getUserByObjectId,
  updateUserById,
  getUserByEmail,
  getUserByVerificationHash,
  createNewUser,
  getUserByPasswordResetToken,
  setUserEmailVerification,
};
