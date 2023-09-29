import { Kysely } from 'kysely';

import { DB, Messages } from '../../types/generated/database';

export type MessagesCreateParams = Omit<Messages, 'id' | 'created_at'>;

export default class MessagesRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getById(id: string) {
		return this.database.selectFrom('messages').where('id', '=', id).executeTakeFirstOrThrow();
	}

	create(messageParams: MessagesCreateParams) {
		return this.database
			.insertInto('messages')
			.values(messageParams)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getByWishCardId(id: string) {
		return this.database.selectFrom('messages').where('wishcard_id', '=', id).execute();
	}
}
