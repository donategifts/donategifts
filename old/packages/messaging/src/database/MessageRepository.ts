import { inject, injectable } from 'inversify';
import { DBMessage } from './DBMessage';

// TODO: needs typing!!
@injectable()
export class MessageRepository {
	constructor(@inject(DBMessage) private dbMessage: typeof DBMessage) {}

	async getMessageByObjectId(messageId) {
		try {
			return this.dbMessage.findOne({ _id: messageId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Message: ${error}`);
		}
	}

	async createNewMessage(messageParams) {
		try {
			return this.dbMessage.create(messageParams);
		} catch (error) {
			throw new Error(`Failed to create new Message: ${error}`);
		}
	}
}
