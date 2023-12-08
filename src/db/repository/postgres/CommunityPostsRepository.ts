import { database } from '../../postgresconnection';
import { CommunityPosts } from '../../types/generated/database';

export type CommunityPostsCreateParams = Omit<CommunityPosts, 'id' | 'created_at'>;

class CommunityPostsRepository {
	private database = database;

	getAll() {
		return this.database.selectFrom('community_posts').selectAll('community_posts').execute();
	}

	getByAgencyVerificationStatus(is_verified = true) {
		return this.database
			.selectFrom('community_posts')
			.innerJoin('agencies', 'agencies.id', 'community_posts.agency_id')
			.where('agencies.is_verified', '=', is_verified)
			.selectAll('community_posts')
			.execute();
	}

	getByAgencyId(id: string) {
		return this.database
			.selectFrom('community_posts')
			.where('agency_id', '=', id)
			.selectAll('community_posts')
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

export default new CommunityPostsRepository();
