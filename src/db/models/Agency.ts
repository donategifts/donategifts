import mongoose from 'mongoose';

interface Agency {
    _id: string;
    agencyName: string;
    agencyWebsite: string;
    agencyPhone: string;
    agencyEIN: string;
    accountManager: string;
    agencyBio: string;
    agencyImage: string;
    agencyAddress: {
        address1: string;
        address2: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
    };
    agencyProfileImage: string; // deprecated but still used in /community
    joined: Date;
    isVerified: boolean;
}

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
        agencyEIN: {
            type: String,
        },
        accountManager: {
            type: Schema.Types.ObjectId,
            ref: 'User',
        },
        agencyBio: {
            type: String,
        },
        agencyImage: {
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
        agencyProfileImage: {
            type: String, // deprecated but still used in /community
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

const Agency = mongoose.model<Agency>('Agency', AgencySchema);

export default Agency;
