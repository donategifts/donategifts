import { InsertObject, UpdateObject } from 'kysely';

import { database } from '../../postgresconnection';
import { DB } from '../../types/generated/database';

export type ItemsUpdateParams = Omit<UpdateObject<DB, 'items'>, 'id' | 'created_at'>;

export type ItemsCreateParams = Omit<InsertObject<DB, 'items'>, 'id' | 'created_at'>;

class ItemsRepository {
	private database = database;

	getById(id: string) {
		return this.database
			.selectFrom('items')
			.where('id', '=', id)
			.selectAll()
			.executeTakeFirstOrThrow();
	}

	update(id: string, updateParams: ItemsUpdateParams) {
		return this.database
			.updateTable('items')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	create(item: ItemsCreateParams) {
		return this.database
			.insertInto('items')
			.values(item)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}

export default new ItemsRepository();
