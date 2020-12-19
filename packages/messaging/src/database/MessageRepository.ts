import { DBMessage } from './DBMessage';

export class MessageRepository {
	async getMessageByObjectId(messageId) {
		try {
			return DBMessage.findOne({ _id: messageId }).exec();
		} catch (error) {
			throw new Error(`Failed to get Message: ${error}`);
		}
	}

	async createNewMessage(messageParams) {
		try {
			const newMessage = new DBMessage(messageParams);
			return newMessage.save();
		} catch (error) {
			throw new Error(`Failed to create new Message: ${error}`);
		}
	}
}
