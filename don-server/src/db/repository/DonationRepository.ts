import { DBDonation } from '../models/Donation';

async function createNewDonation(params) {
  try {
    const newDonation = new DBDonation(params);
    return newDonation.save();
  } catch (error) {
    throw new Error(`Failed to create new Donation: ${error}`);
  }
}

export { createNewDonation };
