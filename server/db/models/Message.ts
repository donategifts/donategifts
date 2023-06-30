import mongoose from 'mongoose';

interface Message {
	messageFrom: string;
	messageTo: string;
	message: string;
	createdAt: Date;
}

const { Schema } = mongoose;
const MessageSchema = new Schema(
	{
		messageFrom: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},
		messageTo: {
			type: Schema.Types.ObjectId,
			ref: 'WishCard',
		},
		message: {
			type: String,
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
	},
	{
		collection: 'messages',
	},
);

const Message = mongoose.model<Message>('Message', MessageSchema);

export default Message;
