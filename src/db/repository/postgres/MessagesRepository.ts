import { database } from '../../postgresconnection';
import { Messages } from '../../types/generated/database';

export type MessagesCreateParams = Omit<Messages, 'id' | 'created_at'>;

class MessagesRepository {
	private database = database;

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
		return this.database
			.selectFrom('messages')
			.where('wishcard_id', '=', id)
			.selectAll()
			.execute();
	}
}

export default new MessagesRepository();
