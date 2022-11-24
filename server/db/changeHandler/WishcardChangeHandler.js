const moment = require('moment');
const WishCard = require('../models/WishCard');
const { getWishCardByObjectId } = require('../repository/WishCardRepository');
const { sendDonationOrderedEmail } = require('../../helper/messaging');
const { getUserByObjectId } = require('../repository/UserRepository');
const {
  getDonationByWishCardId,
  updateDonationStatus,
} = require('../repository/DonationRepository');

function hasWishcardStatusChangedTo(change, status) {
  return (
    change &&
    change.operationType === 'update' &&
    change.updateDescription &&
    change.updateDescription.updatedFields &&
    change.updateDescription.updatedFields.status &&
    change.updateDescription.updatedFields.status === status
  );
}

function wishcardIsOrdered(change) {
  return hasWishcardStatusChangedTo(change, 'ordered');
}

function wishcardIsPublished(change) {
  return hasWishcardStatusChangedTo(change, 'published');
}

async function handleDonationOrdered(change) {
  const wishCard = await getWishCardByObjectId(change.documentKey._id);
  const agency = wishCard.belongsTo;
  const accountManager = await getUserByObjectId(agency.accountManager);
  const donation = await getDonationByWishCardId(wishCard._id);

  await updateDonationStatus(donation._id, 'ordered');
  await sendDonationOrderedEmail({
    agencyEmail: accountManager.email,
    agencyName: agency.agencyName,
    childName: wishCard.childFirstName,
    itemName: wishCard.wishItemName,
    itemPrice: wishCard.wishItemPrice,
    donationDate: moment(new Date(donation.donationDate)).format('MMM Do, YYYY'),
    address: `${agency.agencyAddress.address1} ${agency.agencyAddress.city} ${agency.agencyAddress.zipcode} ${agency.agencyAddress.state}`,
  });
}

async function handleWishcardPublished() {
  // TODO
  return undefined;
}

if (process.env.NODE_ENV === 'production') {
  const wishCardChangeListener = WishCard.watch();

  wishCardChangeListener.on('change', async (change) => {
    if (wishcardIsOrdered(change)) {
      await handleDonationOrdered(change);
    } else if (wishcardIsPublished(change)) {
      await handleWishcardPublished();
    }
  });
}
