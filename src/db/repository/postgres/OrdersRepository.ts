import { Kysely } from 'kysely';

import { DB, Orders } from '../../types/generated/database';

export type CreateParams = Omit<
	Orders,
	'id' | 'status' | 'delivery_date' | 'created_at' | 'updated_at'
>;

export class OrdersRepository {
	constructor(private readonly database: Kysely<DB>) {}

	create(createParams: CreateParams) {
		return this.database.insertInto('orders').values(createParams).returningAll()
			.executeTakeFirstOrThrow;
	}

	getByDonorId(id: string) {
		return this.database.selectFrom('orders').where('donor_id', '=', id).execute();
	}

	getByAgencyId(id: string) {
		return this.database.selectFrom('orders').where('agency_id', '=', id).execute();
	}

	getByWishCardId(id: string) {
		return this.database
			.selectFrom('orders')
			.innerJoin('wishcards', 'orders.item_id', 'wishcards.id')
			.where('wishcards.id', '=', id)
			.executeTakeFirstOrThrow();
	}

	updateStatus(id: string, status: number) {
		return this.database
			.updateTable('orders')
			.set({ status })
			.where('id', '=', id)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}
