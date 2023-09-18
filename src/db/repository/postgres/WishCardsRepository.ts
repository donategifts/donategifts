import { Kysely, UpdateObject } from 'kysely';

import { DB, Wishcards } from '../../types/generated/database';

export type WishcardsUpdateParams = Omit<
	UpdateObject<DB, 'wishcards'>,
	'id' | 'created_at' | 'updated_at' | 'agency_id' | 'child_id'
>;
export type WishcardsCreateParams = Omit<
	Wishcards,
	'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'status'
>;

export default class WishcardsRepository {
	constructor(private readonly database: Kysely<DB>) {}

	async create(createParams: WishcardsCreateParams) {
		const wishcard = await this.database
			.insertInto('wishcards')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();

		return wishcard;
	}

	async getAll() {
		return await this.database.selectFrom('wishcards').selectAll().execute();
	}

	async getByWishItemName(itemName: string) {
		return await this.database
			.selectFrom('wishcards')
			.innerJoin('items', 'wishcards.item_id', 'items.id')
			.selectAll()
			.where('items.name', 'ilike', itemName)
			.executeTakeFirstOrThrow();
	}

	async getById(id: string) {
		return await this.database
			.selectFrom('wishcards')
			.innerJoin('agencies', 'wishcards.agency_id', 'agencies.id')
			.selectAll()
			.where('wishcards.id', '=', id)
			.executeTakeFirstOrThrow();
	}

	async update(id: string, updateParams: WishcardsUpdateParams) {
		return await this.database
			.updateTable('wishcards')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	async delete(id: string) {
		return await this.database
			.deleteFrom('wishcards')
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
	}

	async getByAgencyId(id: string) {
		return await this.database
			.selectFrom('wishcards')
			.innerJoin('agencies', 'wishcards.agency_id', 'agencies.id')
			.selectAll()
			.where('agencies.id', '=', id)
			.executeTakeFirstOrThrow();
	}
}
