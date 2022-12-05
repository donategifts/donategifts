const Message = require('../models/Message');

class MessageRepository {
	constructor() {
		this.messageModel = Message;
	}

	async getMessageByObjectId(messageId) {
		try {
			return await this.messageModel.findOne({ _id: messageId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Message: ${error}`);
		}
	}

	async createNewMessage(messageParams) {
		try {
			return await this.messageModel.create(messageParams);
		} catch (error) {
			throw new Error(`Failed to create new Message: ${error}`);
		}
	}

	async getMessagesByWishCardId(wishcardId) {
		try {
			return this.messageModel
				.find({ messageTo: wishcardId })
				.populate('messageFrom')
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get all Messages of the Wishcard: ${error}`);
		}
	}
}

async function getMessageByObjectId(messageId) {
	try {
		return Message.findOne({ _id: messageId }).exec();
	} catch (error) {
		throw new Error(`Failed to get Message: ${error}`);
	}
}

async function createNewMessage(messageParams) {
	try {
		const newMessage = new Message(messageParams);
		return newMessage.save();
	} catch (error) {
		throw new Error(`Failed to create new Message: ${error}`);
	}
}

async function getMessagesByWishCardId(wishcardId) {
	try {
		return Message.find({ messageTo: wishcardId }).populate('messageFrom').exec();
	} catch (error) {
		throw new Error(`Failed to get all Messages of the Wishcard: ${error}`);
	}
}

module.exports = {
	MessageRepository,
	getMessageByObjectId,
	createNewMessage,
	getMessagesByWishCardId,
};
