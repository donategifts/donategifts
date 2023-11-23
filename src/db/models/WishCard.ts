import mongoose from 'mongoose';

const Status = {
    draft: 'draft',
    published: 'published',
    donated: 'donated',
} as const;

export type STATUS = keyof typeof Status;

interface WishCard {
    _id: string;
    childFirstName: string;
    childLastName: string; // deprecated
    childBirthday: Date; // deprecated
    childBirthYear: string;
    childInterest: string;
    childImage: string;
    childStory: string;
    wishItemName: string;
    wishItemPrice: number;
    wishItemURL: string;
    wishItemInfo: string;
    wishItemImage: string;
    productID: string;
    createdBy: string;
    createdAt: Date;
    deliveryDate: Date; // deprecated
    occasion: string; // deprecated
    address: {
        address1: string;
        address2: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
    };
    isLockedBy: string | null; // deprecated
    isLockedUntil: Date | null; // deprecated
    approvedByAdmin: boolean; // deprecated
    status: string;
    belongsTo: string;
}

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
        childBirthYear: {
            type: String,
        },
        childInterest: {
            type: String,
        },
        childImage: {
            type: String,
        },
        childStory: {
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
        wishItemInfo: {
            type: String,
        },
        wishItemImage: {
            type: String,
        },
        productID: {
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

const WishCard = mongoose.model<WishCard>('WishCard', WishCardSchema);

export default WishCard;
