import { Kysely, UpdateObject } from 'kysely';

import { DB, Users } from '../../types/generated/database';

export type UpdateParams = Omit<UpdateObject<DB, 'users'>, 'id' | 'created_at' | 'updated_at'>;
export type CreateParams = Omit<
	Users,
	'id' | 'is_verified' | 'created_at' | 'updated_at' | 'deleted_at'
>;

export default class UsersRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getUserById(id: string) {
		return this.database.selectFrom('users').where('id', '=', id).executeTakeFirstOrThrow();
	}

	updateUser(id: string, updateParams: UpdateParams) {
		return this.database
			.updateTable('users')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getUserByEmail(email: string) {
		return this.database
			.selectFrom('users')
			.where('email', '=', email)
			.executeTakeFirstOrThrow();
	}

	getUserByVerificationToken(verificationToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', verificationToken)
			.selectAll('users')
			.executeTakeFirstOrThrow();
	}

	async createNewUser(createParams: CreateParams) {
		const result = await this.database
			.insertInto('users')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();

		await this.database
			.insertInto('verifications')
			.values({ user_id: result.id, email_verified: false })
			.execute();

		return result;
	}

	getUserByPasswordResetToken(resetToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', resetToken)
			.selectAll('users')
			.executeTakeFirstOrThrow();
	}

	async setUserEmailVerification(userId: string, verified: boolean) {
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
