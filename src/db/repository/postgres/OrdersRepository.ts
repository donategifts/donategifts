import { Kysely } from 'kysely';

import { DB, Orders, Orderstatus } from '../../types/generated/database';

export type OrdersCreateParams = Omit<
	Orders,
	'id' | 'status' | 'delivery_date' | 'created_at' | 'updated_at'
>;

export default class OrdersRepository {
	constructor(private readonly database: Kysely<DB>) {}

	create(createParams: OrdersCreateParams) {
		return this.database.insertInto('orders').values(createParams).returningAll()
			.executeTakeFirstOrThrow;
	}

	getByDonorId(id: string) {
		return this.database.selectFrom('orders').where('donor_id', '=', id).execute();
	}

	getByAgencyId(id: string) {
		return this.database
			.selectFrom('orders')
			.innerJoin('wishcards', 'orders.wishcard_id', 'wishcards.id')
			.innerJoin('agencies', 'wishcards.created_by', 'agencies.id')
			.where('agencies.id', '=', id)
			.selectAll('wishcards')
			.execute();
	}

	getByWishCardId(id: string) {
		return this.database
			.selectFrom('orders')
			.where('wishcard_id', '=', id)
			.executeTakeFirstOrThrow();
	}

	updateStatus(id: string, status: Orderstatus) {
		return this.database
			.updateTable('orders')
			.set({ status })
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}