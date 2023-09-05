import { Kysely } from 'kysely';

import { DB, CommunityPosts } from '../../types/generated/database';

export type CommunityPostsCreateParams = Omit<CommunityPosts, 'id' | 'created_at'>;

export default class CommunityPostsRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getAll() {
		return this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'community_posts.id', 'agencies.id')
			.selectAll()
			.execute();
	}

	getAllByVerifiedAgencies() {
		return this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'community_posts.id', 'agencies.id')
			.where('agencies.verified', '=', true)
			.selectAll()
			.execute();
	}

	create(postParams: CommunityPostsCreateParams) {
		return this.database
			.insertInto('community_posts')
			.values(postParams)
			.returningAll()
			.executeTakeFirstOrThrow();
	}
}
