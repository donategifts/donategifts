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

	getAll() {
		return this.database.selectFrom('wishcards').selectAll().execute();
	}

	getByWishItemName(itemName: string) {
		return this.database
			.selectFrom('wishcards')
			.innerJoin('items', 'wishcards.item_id', 'items.id')
			.selectAll()
			.where('items.name', 'ilike', itemName)
			.executeTakeFirstOrThrow();
	}

	getById(id: string) {
		return this.database
			.selectFrom('wishcards')
			.innerJoin('agencies', 'wishcards.agency_id', 'agencies.id')
			.selectAll()
			.where('wishcards.id', '=', id)
			.executeTakeFirstOrThrow();
	}

	update(id: string, updateParams: WishcardsUpdateParams) {
		return this.database
			.updateTable('wishcards')
			.set(updateParams)
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	delete(id: string) {
		return this.database.deleteFrom('wishcards').where('id', '=', id).executeTakeFirstOrThrow();
	}

	getByAgencyId(id: string) {
		return this.database
			.selectFrom('wishcards')
			.innerJoin('agencies', 'wishcards.agency_id', 'agencies.id')
			.selectAll()
			.where('agencies.id', '=', id)
			.executeTakeFirstOrThrow();
	}
}
