import { Kysely, UpdateObject } from 'kysely';

import { Agencies, DB } from '../../types/generated/database';

export type AgenciesUpdateParams = Omit<
	UpdateObject<DB, 'agencies'>,
	'id' | 'created_at' | 'updated_at'
>;
export type AgenciesCreateParams = Omit<
	Agencies,
	'id' | 'is_verified' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export default class AgenciesRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getByUserId(id: string) {
		return this.database
			.selectFrom('agencies')
			.where('account_manager_id', '=', id)
			.executeTakeFirstOrThrow();
	}

	getByName(name: string) {
		return this.database
			.selectFrom('agencies')
			.where('name', '=', name)
			.executeTakeFirstOrThrow();
	}

	create(createParams: AgenciesCreateParams) {
		return this.database
			.insertInto('agencies')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	verify(id: string) {
		return this.database
			.updateTable('agencies')
			.set({ is_verified: true })
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getVerified() {
		return this.database.selectFrom('agencies').where('is_verified', '=', true).execute();
	}

	getUnverified() {
		return this.database.selectFrom('agencies').where('is_verified', '=', false).execute();
	}

	update(id: string, updateParams: AgenciesUpdateParams) {
		return this.database
			.updateTable('agencies')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}
