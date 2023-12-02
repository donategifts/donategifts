import { UpdateObject } from 'kysely';

import { database } from '../../postgresconnection';
import { Agencies, DB } from '../../types/generated/database';

export type AgenciesUpdateParams = Omit<
	UpdateObject<DB, 'agencies'>,
	'id' | 'created_at' | 'updated_at'
>;
export type AgenciesCreateParams = Omit<
	Agencies,
	'id' | 'is_verified' | 'created_at' | 'updated_at'
>;

class AgenciesRepository {
	private database = database;

	getById(id: string) {
		return this.database
			.selectFrom('agencies')
			.where('id', '=', id)
			.selectAll()
			.executeTakeFirstOrThrow();
	}

	getByAccountManagerId(id: string) {
		return this.database
			.selectFrom('agencies')
			.where('account_manager_id', '=', id)
			.selectAll()
			.executeTakeFirstOrThrow();
	}

	getByName(name: string) {
		return this.database
			.selectFrom('agencies')
			.where('name', '=', name)
			.selectAll()
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

	getByVerificationStatus(is_verified: boolean) {
		return this.database
			.selectFrom('agencies')
			.where('is_verified', '=', is_verified)
			.selectAll()
			.execute();
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

export default new AgenciesRepository();
