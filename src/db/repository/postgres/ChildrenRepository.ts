import { Kysely } from 'kysely';

import { Children, DB } from '../../types/generated/database';

export type ChildrenCreateParams = Omit<Children, 'id' | 'created_at'>;
export type ChildrenUpdateParams = Partial<Omit<Children, 'id' | 'created_at'>>;

export default class ChildrenRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getById(id: string) {
		return this.database
			.selectFrom('children')
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
	}

	create(createParams: ChildrenCreateParams) {
		return this.database
			.insertInto('children')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getAll() {
		return this.database
			.selectFrom('children')
			.selectAll()
			.execute();
	}

	updateById(id: string, updateParams: ChildrenUpdateParams) {
		return this.database
			.updateTable('children')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}
