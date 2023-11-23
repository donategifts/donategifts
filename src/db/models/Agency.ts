import mongoose from 'mongoose';

interface Agency {
    _id: string;
    agencyName: string;
    agencyWebsite: string;
    agencyPhone: string;
    accountManager: string;
    agencyBio: string;
    agencyAddress: {
        address1: string;
        address2: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
    };
    childrenUnderCare: number;
    childrenAgeRange: string;
    agencyProfileImage: string;
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
