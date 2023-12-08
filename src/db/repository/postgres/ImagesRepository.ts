import { UpdateObject, InsertObject } from 'kysely';

import { database } from '../../postgresconnection';
import { DB } from '../../types/generated/database';

export type ImagesUpdateParams = Omit<
	UpdateObject<DB, 'images'>,
	'id' | 'created_at' | 'updated_at'
>;

export type ImagesCreateParams = Omit<InsertObject<DB, 'images'>, 'id' | 'created_at'>;

class ImagesRepository {
	private database = database;

	getById(id: string) {
		return this.database
			.selectFrom('images')
			.where('id', '=', id)
			.selectAll()
			.executeTakeFirstOrThrow();
	}

	update(id: string, updateParams: ImagesUpdateParams) {
		return this.database
			.updateTable('images')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	create(image: ImagesCreateParams) {
		return this.database
			.insertInto('images')
			.values(image)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}

export default new ImagesRepository();
