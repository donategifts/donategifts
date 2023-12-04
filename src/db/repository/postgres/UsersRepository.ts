import { UpdateObject } from 'kysely';

import Utils from '../../../helper/utils';
import { database } from '../../postgresconnection';
import { DB, Users, Verificationtype } from '../../types/generated/database';

export type UsersUpdateParams = Omit<UpdateObject<DB, 'users'>, 'id' | 'created_at' | 'updated_at'>;
export type UsersCreateParams = Omit<
	Users,
	'id' | 'is_verified' | 'is_disabled' | 'created_at' | 'updated_at'
>;

class UsersRepository {
	private database = database;

	getById(id: string) {
		return this.database
			.selectFrom('users')
			.where('id', '=', id)
			.selectAll()
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
			.selectAll()
			.executeTakeFirst();
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
		const { login_mode } = createParams;

		const user = await this.database
			.insertInto('users')
			.values({
				...createParams,
				is_verified: login_mode !== 'email',
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		if (login_mode === 'email') {
			const { token: emailVerificationToken } = await this.database
				.insertInto('verification_tokens')
				.values({
					user_id: user.id,
					token: Utils.createEmailVerificationHash(),
					type: verificationType,
					// 15 minutes from time of insertion
					expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
				})
				.returning('token')
				.executeTakeFirstOrThrow();

			return { user, emailVerificationToken };
		}

		return { user };
	}

	getByPasswordResetToken(resetToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', resetToken)
			.selectAll('verification_tokens')
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

export default new UsersRepository();
