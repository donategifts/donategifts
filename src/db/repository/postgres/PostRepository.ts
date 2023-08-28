import { Kysely } from 'kysely';

import { DB, CommunityPosts } from '../../types/generated/database';

export default class PostRepository {
	constructor(private readonly database: Kysely<DB>) {}

	getAllPosts() {
		return this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'community_posts.id', 'agencies.id')
			.selectAll()
			.execute();
	}

	getAllPostsByVerifiedAgencies() {
		return this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'community_posts.id', 'agencies.id')
			.where('agencies.verified', '=', true)
			.selectAll()
			.execute();
	}

	createNewPost(postParams: Omit<CommunityPosts, 'id' | 'created_at'>) {
		return this.database.insertInto('community_posts').values(postParams).execute();
	}
}
