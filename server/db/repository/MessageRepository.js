const Message = require('../models/Message');

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
	getMessageByObjectId,
	createNewMessage,
	getMessagesByWishCardId,
};
