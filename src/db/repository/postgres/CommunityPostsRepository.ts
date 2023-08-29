import { Kysely } from 'kysely';

import { DB, CommunityPosts } from '../../types/generated/database';

export default class CommunityPostsRepository {
	constructor(private readonly database: Kysely<DB>) {}

	async getAllPosts() {
		return await this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'community_posts.id', 'agencies.id')
			.selectAll()
			.execute();
	}

	async getAllPostsByVerifiedAgencies() {
		return await this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'community_posts.id', 'agencies.id')
			.where('agencies.verified', '=', true)
			.selectAll()
			.execute();
	}

	async createNewPost(postParams: Omit<CommunityPosts, 'id' | 'created_at'>) {
		return await this.database.insertInto('community_posts').values(postParams).execute();
	}
}
