// TODO: REVIEW THE RELATIONS OF THE SCHEMAS
// TODO: edit the image file types

const mongoose = require('mongoose');

// SCHEMA SETUP
const { Schema } = mongoose;
const DonationSchema = new Schema(
	{
		donationFrom: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		donationTo: {
			type: Schema.Types.ObjectId,
			ref: 'Agency',
		},
		donationCard: {
			type: Schema.Types.ObjectId,
			ref: 'WishCard',
		},
		donationPrice: {
			type: Number,
		},
		donationDate: {
			type: Date,
			default: Date.now,
		},
		status: {
			type: String,
			enum: ['confirmed', 'ordered', 'delivered'],
			default: 'confirmed',
		},
	},
	{
		collection: 'donations',
	},
);

module.exports = mongoose.model('Donation', DonationSchema);
