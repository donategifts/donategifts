import { Expression, Kysely, SqlBool, UpdateObject } from 'kysely';

import Messaging from '../../../helper/messaging';
import { DB, Wishcards, Wishcardstatus } from '../../types/generated/database';

export type WishcardsUpdateParams = Omit<
	UpdateObject<DB, 'wishcards'>,
	'id' | 'created_at' | 'updated_at' | 'agency_id' | 'child_id'
>;
export type WishcardsCreateParams = Omit<Wishcards, 'id' | 'created_at' | 'updated_at' | 'status'>;

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
		return this.database.selectFrom('wishcards').selectAll().execute();
	}

	getByWishItemName(itemName: string) {
		return this.database
			.selectFrom('wishcards')
			.innerJoin('items', 'items.id', 'wishcards.item_id')
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
		return this.database
			.updateTable('wishcards')
			.set({ status: 'draft' })
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
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

	getByStatus(status: Wishcardstatus) {
		return this.database
			.selectFrom('wishcards')
			.innerJoin('children', 'children.id', 'wishcards.child_id')
			.innerJoin('agencies', 'agencies.id', 'children.agency_id')
			.selectAll(['wishcards', 'agencies'])
			.where('status', '=', status)
			.executeTakeFirstOrThrow();
	}

	getRandom(status: Wishcardstatus, sampleSize: number) {
		return this.database
			.selectFrom('wishcards')
			.selectAll()
			.limit(sampleSize)
			.where('status', '=', status)
			.executeTakeFirstOrThrow();
	}

	getViewable(showDonated: boolean) {
		return this.database
			.selectFrom('wishcards')
			.selectAll()
			.where((eb) => {
				const filters: Expression<SqlBool>[] = [];
				filters.push(eb('status', '=', 'published'));

				if (showDonated) {
					filters.push(eb('status', '=', 'donated'));
				}
				return eb.and(filters);
			})
			.executeTakeFirstOrThrow();
	}

	getFuzzy(searchQuery: string, showDonated: boolean, reverseSort: boolean, cardsIds?: string[]) {
		const likeSearchQuery = '%' + searchQuery + '%';
		const sortOrder = reverseSort ? 'desc' : 'asc';
		return this.database
			.selectFrom('wishcards')
			.innerJoin('children', 'children.id', 'wishcards.child_id')
			.innerJoin('items', 'items.id', 'wishcards.item_id')
			.selectAll()
			.where((eb) => {
				const filters: Expression<SqlBool>[] = [];
				filters.push(eb('status', '=', 'published'));
				if (showDonated) {
					filters.push(eb('status', '=', 'donated'));
				}
				filters.push(
					eb('items.name', 'ilike', likeSearchQuery),
					eb('children.story', 'ilike', likeSearchQuery),
					eb('children.interest', 'ilike', likeSearchQuery),
					eb('children.first_name', 'ilike', likeSearchQuery),
					eb('children.last_name', 'ilike', likeSearchQuery),
				);
				if (cardsIds) {
					return eb.and(filters).or(eb('wishcards.id', 'in', cardsIds));
				}
				return eb.and(filters);
			})
			.orderBy('wishcards.status', 'desc')
			.orderBy('wishcards.created_at', sortOrder)
			.executeTakeFirstOrThrow();
	}

	// Following two may need to be modified/moved elsewhere depending on how wishcard locking/polling is handled
	async handleDonationOrdered(id: string) {
		const {
			agencyEmail,
			agencyName,
			childFirstName,
			itemName,
			itemPrice,
			orderDate,
			addressLine1,
			addressLine2,
			city,
			state,
			zipCode,
		} = await this.database
			.selectFrom('orders')
			.innerJoin('wishcards', 'wishcards.id', 'orders.wishcard_id')
			.innerJoin('children', 'children.id', 'wishcards.child_id')
			.innerJoin('agencies', 'agencies.id', 'children.agency_id')
			.innerJoin('users', 'agencies.account_manager_id', 'users.id')
			.innerJoin('items', 'item_id', 'wishcards.item_id')
			.select([
				'users.email as agencyEmail',
				'agencies.name as agencyName',
				'children.first_name as childFirstName',
				'items.name as itemName',
				'items.price as itemPrice',
				'orders.created_at as orderDate',
				'agencies.address_line_1 as addressLine1',
				'agencies.address_line_2 as addressLine2',
				'agencies.city',
				'agencies.state',
				'agencies.zip_code as zipCode',
			])
			.where('orders.wishcard_id', '=', id)
			.executeTakeFirstOrThrow();

		await Messaging.sendAgencyDonationEmail({
			agencyEmail,
			agencyName,
			childName: childFirstName,
			item: itemName,
			price: itemPrice,
			donationDate: orderDate,
			address: `${addressLine1} ${addressLine2} ${city}, ${state} ${zipCode}`,
		});
	}

	async handlePublished(id: string) {
		const { email: agencyEmail, first_name: childName } = await this.database
			.selectFrom('wishcards')
			.innerJoin('children', 'children.id', 'wishcards.child_id')
			.innerJoin('agencies', 'agencies.id', 'children.agency_id')
			.innerJoin('users', 'agencies.account_manager_id', 'users.id')
			.select(['users.email', 'children.first_name'])
			.where('wishcards.id', '=', id)
			.executeTakeFirstOrThrow();

		await Messaging.sendWishPublishedEmail({ agencyEmail, childName });
	}
}
