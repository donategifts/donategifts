import { database } from '../../postgresconnection';
import { Orders, Orderstatus } from '../../types/generated/database';

export type OrdersCreateParams = Omit<
	Orders,
	'id' | 'status' | 'delivery_date' | 'created_at' | 'updated_at'
>;

class OrdersRepository {
	private database = database;

	create(createParams: OrdersCreateParams) {
		return this.database
			.insertInto('orders')
			.values(createParams)
			.returningAll()
			.executeTakeFirstOrThrow();
	}

	getByDonorId(id: string) {
		return this.database.selectFrom('orders').where('donor_id', '=', id).selectAll().execute();
	}

	getByAgencyId(id: string) {
		return this.database
			.selectFrom('orders')
			.innerJoin('wishcards', 'wishcards.id', 'orders.wishcard_id')
			.innerJoin('children', 'children.id', 'wishcards.child_id')
			.innerJoin('agencies', 'agencies.id', 'children.agency_id')
			.where('agencies.id', '=', id)
			.selectAll('orders')
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

export default new OrdersRepository();
