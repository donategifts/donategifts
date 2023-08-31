import { Kysely } from 'kysely';

import { DB, Messages } from '../../types/generated/database';

export default class MessagesRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getMessageByObjectId(messageId: string) {
		return this.database.selectFrom('messages').where('id', '=', messageId).execute();
	}

	async createNewMessage(messageParams: Omit<Messages, 'id' | 'created_at'>) {
		await this.database.insertInto('messages').values(messageParams).execute();
	}

	getMessagesByWishCardId(wishcardId: string) {
		return this.database.selectFrom('messages').where('wishcard_id', '=', wishcardId).execute();
	}
}
