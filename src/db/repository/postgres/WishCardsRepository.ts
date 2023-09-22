import { Kysely, UpdateObject } from 'kysely';

import { DB, Wishcards } from '../../types/generated/database';

export type WishcardsUpdateParams = Omit<
	UpdateObject<DB, 'wishcards'>,
	'id'
	| 'created_at'
	| 'updated_at'
	| 'agency_id'
	| 'child_id'
>;
export type WishcardsCreateParams = Omit<
	Wishcards,
	'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'status'
>;

export default class WishcardsRepository {
	constructor(private readonly database: Kysely<DB>) {}

	create(createParams: WishcardsCreateParams) {
		return this.database
			.insertInto('wishcards')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getAll() {
		return this.database
			.selectFrom('wishcards')
			.selectAll()
			.execute();
	}

	getByWishItemName(itemName: string) {
		return this.database
			.selectFrom('wishcards')
			.innerJoin('items', 'wishcards.item_id', 'items.id')
			.selectAll('wishcards')
			.where('items.name', 'ilike', itemName)
			.executeTakeFirstOrThrow();
	}

	getById(id: string) {
		return this.database
			.selectFrom('wishcards')
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
			.innerJoin('children', 'children.id', 'wishcards.child_id')
			.innerJoin('agencies', 'agencies.id', 'children.agency_id')
			.selectAll('wishcards')
			.where('agencies.id', '=', id)
			.executeTakeFirstOrThrow();
	}
}
