import { Kysely } from 'kysely';

import { DB, CommunityPosts } from '../../types/generated/database';

export type CommunityPostsCreateParams = Omit<CommunityPosts, 'id' | 'created_at'>;

export default class CommunityPostsRepository {
    constructor(private readonly database: Kysely<DB>) {}

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
