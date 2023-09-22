import { Kysely, UpdateObject } from 'kysely';

import Utils from '../../../helper/utils';
import { DB, Users, Verificationtype } from '../../types/generated/database';

export type UsersUpdateParams = Omit<UpdateObject<DB, 'users'>, 'id' | 'created_at' | 'updated_at'>;
export type UsersCreateParams = Omit<
	Users,
	'id'
	| 'is_verified'
	| 'is_disabled'
	| 'created_at'
	| 'updated_at'
>;

export default class UsersRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getById(id: string) {
		return this.database
			.selectFrom('users')
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
	}

	update(id: string, updateParams: UsersUpdateParams) {
		return this.database
			.updateTable('users')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getByEmail(email: string) {
		return this.database
			.selectFrom('users')
			.where('email', '=', email)
			.executeTakeFirstOrThrow();
	}

	getByVerificationToken(verificationToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', verificationToken)
			.selectAll('users')
			.executeTakeFirstOrThrow();
	}

	async create(createParams: UsersCreateParams, verificationType: Verificationtype) {
		const user = await this.database
			.insertInto('users')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();

		const { token: emailVerificationToken } = await this.database
			.insertInto('verification_tokens')
			.values({
				user_id: user.id,
				token: Utils.createEmailVerificationHash(),
				type: verificationType,
				expires_at: new Date(),
			})
			.returning('token')
			.executeTakeFirstOrThrow();

		return { user, emailVerificationToken };
	}

	getByPasswordResetToken(resetToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', resetToken)
			.selectAll('users')
			.executeTakeFirstOrThrow();
	}

	updateVerificationStatus(userId: string, is_verified: boolean) {
		return this.database
			.updateTable('users')
			.set({ is_verified })
			.where('id', '=', userId)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}
