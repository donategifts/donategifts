// TODO: REVIEW THE RELATIONS OF THE SCHEMAS
// TODO: edit the image file types

const mongoose = require('mongoose');

// SCHEMA SETUP
const { Schema } = mongoose;
const AgencySchema = new Schema(
  {
    agencyName: {
      type: String,
    },
    agencyWebsite: {
      type: String,
    },
    agencyPhone: {
      type: String,
    },
    accountManager: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    agencyBio: {
      type: String,
    },
    agencyAddress: {
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipcode: { type: String },
    },
    childrenUnderCare: {
      type: Number,
    },
    childrenAgeRange: {
      type: String,
    },
    agencyProfileImage: {
      type: String,
    },
    wishCards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'WishCard',
      },
    ],
    joinedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    joined: {
      type: Date,
      default: Date.now,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    collection: 'agencies',
  },
);

module.exports = mongoose.model('Agency', AgencySchema);
