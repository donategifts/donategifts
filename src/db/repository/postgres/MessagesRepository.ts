import { Kysely } from 'kysely';

import { DB, Messages } from '../../types/generated/database';

export default class MessagesRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getMessageById(id: string) {
		return this.database.selectFrom('messages').where('id', '=', id).execute();
	}

	async createNewMessage(messageParams: Omit<Messages, 'id' | 'created_at'>) {
		await this.database.insertInto('messages').values(messageParams).execute();
	}

	getMessagesByWishCardId(id: string) {
		return this.database.selectFrom('messages').where('wishcard_id', '=', id).execute();
	}
}
