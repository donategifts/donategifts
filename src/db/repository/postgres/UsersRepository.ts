import { Kysely, UpdateObject } from 'kysely';

import Utils from '../../../helper/utils';
import { DB, Users } from '../../types/generated/database';

export type UsersUpdateParams = Omit<UpdateObject<DB, 'users'>, 'id' | 'created_at' | 'updated_at'>;
export type UsersCreateParams = Omit<
	Users,
	'id' | 'is_verified' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export default class UsersRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getById(id: string) {
		return this.database.selectFrom('users').where('id', '=', id).executeTakeFirstOrThrow();
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

	async create(createParams: UsersCreateParams) {
		const user = await this.database
			.insertInto('users')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();

		await this.database
			.insertInto('verifications')
			.values({ user_id: user.id, email_verified: false })
			.execute();

		const { token } = await this.database
			.insertInto('verification_tokens')
			.values({
				user_id: user.id,
				token: Utils.createEmailVerificationHash(),
				type: 0,
				expiration: new Date(),
			})
			.returning('token')
			.executeTakeFirstOrThrow();

		return { user, emailVerificationHash: token };
	}

	getByPasswordResetToken(resetToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', resetToken)
			.selectAll('users')
			.executeTakeFirstOrThrow();
	}

	async setEmailVerification(userId: string, verified: boolean) {
		const result = await this.database
			.updateTable('users')
			.set({ is_verified: verified })
			.where('id', '=', userId)
			.returningAll()
			.executeTakeFirstOrThrow();

		await this.database
			.updateTable('verifications')
			.set({ email_verified: verified })
			.where('user_id', '=', result.id)
			.execute();

		return result;
	}
}
