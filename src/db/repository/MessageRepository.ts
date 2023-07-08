import Message from '../models/Message';

export default class MessageRepository {
	private messageModel: typeof Message;

	constructor() {
		this.messageModel = Message;
	}

	async getMessageByObjectId(messageId: string) {
		try {
			return await this.messageModel.findOne({ _id: messageId }).lean().exec();
		} catch (error) {
			throw new Error(`Failed to get Message: ${error}`);
		}
	}

	async createNewMessage(messageParams: Partial<Message>) {
		try {
			return await this.messageModel.create(messageParams);
		} catch (error) {
			throw new Error(`Failed to create new Message: ${error}`);
		}
	}

	async getMessagesByWishCardId(wishcardId: string) {
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
