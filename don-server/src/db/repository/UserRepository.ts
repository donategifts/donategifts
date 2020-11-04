// IMPORT USER MODEL
import User, { findOne, updateOne } from '../models/User';

async function getUserByObjectId(id) {
  try {
    return findOne({ _id: id }).exec();
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function updateUserById(id, updateParams) {
  try {
    await updateOne({ _id: id }, { $set: updateParams }).exec();
  } catch (error) {
    throw new Error(`Failed to update user: ${error}`);
  }
}

async function getUserByEmail(email) {
  try {
    return findOne({ email }).exec();
  } catch (error) {
    throw new Error(`Failed to get DB user: ${error}`);
  }
}

async function getUserByVerificationHash(verificationHash) {
  try {
    return findOne({ verificationHash }).exec();
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
    return findOne({ passwordResetToken: tokenId }).exec();
  } catch (error) {
    throw new Error(`Failed to get User: ${error}`);
  }
}

async function setUserEmailVerification(userId, verified) {
  try {
    await updateOne({ _id: userId }, { $set: { emailVerified: verified } });
  } catch (error) {
    throw new Error(`Failed to set email verification: ${error}`);
  }
}

export {
  getUserByObjectId,
  updateUserById,
  getUserByEmail,
  getUserByVerificationHash,
  createNewUser,
  getUserByPasswordResetToken,
  setUserEmailVerification,
};
