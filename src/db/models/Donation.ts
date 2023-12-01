import mongoose from 'mongoose';

const Status = {
	confirmed: 'confirmed',
	ordered: 'ordered',
	delivered: 'delivered',
} as const;

export type STATUS = keyof typeof Status;

interface Donation {
	_id: string;
	donationFrom: string;
	donationTo: string;
	donationCard: string;
	donationPrice: number;
	donationDate: Date;
	tracking_info: string | undefined;
	status: keyof typeof Status;
}

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
		tracking_info: {
			type: String,
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

const Donation = mongoose.model<Donation>('Donation', DonationSchema);

export default Donation;
