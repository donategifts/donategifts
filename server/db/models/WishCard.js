// TODO: HOW SHOULD WE STORE USER ROLE?
// TODO: REVIEW THE RELATIONS OF THE SCHEMAS

const mongoose = require('mongoose');

// SCHEMA SETUP
const { Schema } = mongoose;
const WishCardSchema = new Schema(
  {
    childFirstName: {
      type: String,
    },
    childLastName: {
      type: String,
    },
    childBirthday: {
      type: Date,
    },
    childInterest: {
      type: String,
    },
    wishItemName: {
      type: String,
    },
    wishItemPrice: {
      type: Number,
    },
    wishItemURL: {
      type: String,
    },
    childStory: {
      type: String,
    },
    wishCardImage: {
      type: String,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    deliveryDate: {
      type: Date,
    },
    occasion: {
      type: String,
    },
    address: {
      address1: { type: String },
      address2: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      zipcode: { type: String },
    },
    isDonated: {
      type: Boolean,
      default: false,
    },
    isLockedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    isLockedUntil: {
      type: Date,
    },
    approvedByAdmin: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'donated'],
      default: 'draft',
    },
    belongsTo: {
      type: Schema.Types.ObjectId,
      ref: 'Agency',
    },
  },
  {
    collection: 'wishcards',
  },
);

module.exports = mongoose.model('WishCard', WishCardSchema);
