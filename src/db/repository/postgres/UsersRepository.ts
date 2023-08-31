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
		return this.database.selectFrom('users').where('id', '=', id).execute();
	}

	updateUser(id: string, updateParams: UpdateParams) {
		return this.database
			.updateTable('users')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.execute();
	}

	getUserByEmail(email: string) {
		return this.database.selectFrom('users').where('email', '=', email).execute();
	}

	getUserByVerificationToken(verificationToken: string) {
		return this.database
			.selectFrom('users')
			.innerJoin('verification_tokens', 'verification_tokens.user_id', 'users.id')
			.where('verification_tokens.token', '=', verificationToken)
			.selectAll('users')
			.execute();
	}

	async createNewUser(userParams: CreateParams) {
		const [result] = await this.database
			.insertInto('users')
			.values(userParams)
			.returningAll()
			.execute();

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
			.execute();
	}

	async setUserEmailVerification(userId: string, verified: boolean) {
		const [result] = await this.database
			.updateTable('users')
			.set({ is_verified: verified })
			.where('id', '=', userId)
			.returningAll()
			.execute();

		await this.database
			.updateTable('verifications')
			.set({ email_verified: verified })
			.where('user_id', '=', result.id)
			.execute();

		return result;
	}
}
