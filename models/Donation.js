//TODO: REVIEW THE RELATIONS OF THE SCHEMAS
//TODO: edit the image file types

const mongoose = require('mongoose');

//SCHEMA SETUP
let Schema = mongoose.Schema;
let DonationSchema = new Schema(
  {
    donationFrom: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    donationTo: {
      type: Schema.Types.ObjectId,
      ref: 'WishCard',
    },
    donationPrice: {
      type: Number,
    },
    donationConfirmed: {
      type: Boolean,
    },
    donationDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: 'donations',
  }
);

module.exports = mongoose.model('Donation', DonationSchema);
