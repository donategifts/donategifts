const Message = require('../models/Message');

module.exports = class MessageRepository {
	#messageModel;

	constructor() {
		this.#messageModel = Message;
	}

	async getMessageByObjectId(messageId) {
		try {
			return await this.#messageModel.findOne({ _id: messageId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Message: ${error}`);
		}
	}

	async createNewMessage(messageParams) {
		try {
			return await this.#messageModel.create(messageParams);
		} catch (error) {
			throw new Error(`Failed to create new Message: ${error}`);
		}
	}

	async getMessagesByWishCardId(wishcardId) {
		try {
			return this.#messageModel
				.find({ messageTo: wishcardId })
				.populate('messageFrom')
				.lean()
				.exec();
		} catch (error) {
			throw new Error(`Failed to get all Messages of the Wishcard: ${error}`);
		}
	}
};
