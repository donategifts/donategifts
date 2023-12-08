import { InsertObject, UpdateObject } from 'kysely';

import { database } from '../../postgresconnection';
import { DB } from '../../types/generated/database';

export type VerificationTokensUpdateParams = Omit<
	UpdateObject<DB, 'verification_tokens'>,
	'id' | 'created_at'
>;

export type VerificationTokensCreateParams = Omit<
	InsertObject<DB, 'verification_tokens'>,
	'id' | 'created_at'
>;

class VerificationTokensRepository {
	private database = database;

	getById(id: string) {
		return this.database
			.selectFrom('verification_tokens')
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
	}

	update(id: string, updateParams: VerificationTokensUpdateParams) {
		return this.database
			.updateTable('verification_tokens')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	create(verificationTokenParams: VerificationTokensCreateParams) {
		return this.database
			.insertInto('verification_tokens')
			.values(verificationTokenParams)
			.returning('token')
			.executeTakeFirstOrThrow();
	}

	getByUserId(userId: string) {
		return this.database
			.selectFrom('verification_tokens')
			.where('user_id', '=', userId)
			.select('token')
			.executeTakeFirstOrThrow();
	}

	getByToken(token: string) {
		return this.database
			.selectFrom('verification_tokens')
			.where('token', '=', token)
			.selectAll()
			.executeTakeFirstOrThrow();
	}
}

export default new VerificationTokensRepository();
