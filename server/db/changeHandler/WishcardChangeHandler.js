const WishCard = require('../models/WishCard');
const { getWishCardByObjectId } = require('../repository/WishCardRepository');
const { sendDonationOrderedEmail } = require('../../helper/messaging');
const { getUserByObjectId } = require('../repository/UserRepository');
const { getDonationByWishCardId } = require('../repository/DonationRepository');
const moment = require('moment');

const wishCardChangeListener = WishCard.watch();

wishCardChangeListener.on('change', async (change) => {
  if (
    change.operationType === 'update' &&
    change.updateDescription &&
    change.updateDescription.updatedFields &&
    change.updateDescription.updatedFields.status &&
    change.updateDescription.updatedFields.status === 'ordered'
  ) {
    const wishCard = await getWishCardByObjectId(change.documentKey._id);
    const agency = wishCard.belongsTo;
    const accountManager = await getUserByObjectId(agency.accountManager);
    const donation = await getDonationByWishCardId(wishCard._id);
    console.log(wishCard);
    console.log(agency);
    console.log(accountManager);
    console.log(donation);
    sendDonationOrderedEmail({
      agencyEmail: accountManager.email,
      agencyName: agency.agencyName,
      childName: wishCard.childFirstName,
      itemName: wishCard.wishItemName,
      itemPrice: wishCard.wishItemPrice,
      donationDate: moment(new Date(donation.donationDate)).format('MMM Do, YYYY'),
      address: `${agency.agencyAddress.address1} ${agency.agencyAddress.city} ${agency.agencyAddress.zipcode} ${agency.agencyAddress.state}`,
    });
  }
});
