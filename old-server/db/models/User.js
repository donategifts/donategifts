// TODO: REVIEW THE RELATIONS OF THE SCHEMAS
// TODO: ADD PASSWORD CONSTRAINTS
// TODO: AUTHENTICATION & SECURITY & TOKENS FOR PASSWORD RESET

const mongoose = require('mongoose');

// SCHEMA SETUP
const { Schema } = mongoose;
const UserSchema = new Schema(
  {
    fName: {
      type: String,
      required: true,
    },
    lName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    verificationHash: {
      type: String,
      unique: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetTokenExpires: {
      type: Date,
    },
    userRole: {
      type: String,
      enum: ['donor', 'partner', 'admin'],
    },
    /* ROLES: Donor, Partner, Admin */
    /* IF THE USER IS PARTNER OR ADMIN, THEY CAN CREATE WISH CARDS */
    joined: {
      type: Date,
      default: Date.now,
    },
    aboutMe: {
      type: String,
      required: false,
    },
    /** Facebook | Google | Default */
    loginMode: {
      type: String,
      required: false,
    },
    profileImage: {
      type: String,
    },
  },
  {
    collection: 'users',
  },
);

module.exports = mongoose.model('User', UserSchema);
