import { Kysely, KyselyConfig, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import { DB } from '../../types/database';
import config from '../helper/config';
import logger from '../helper/logger';

const databaseConfig: KyselyConfig = {
	log(event): void {
		if (event.level === 'query') {
			logger.debug(event.query.sql);
			logger.debug(event.query.parameters);
		} else if (event.level === 'error') {
			logger.error(event);
		}
	},
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: config.DATABASE_URL,
		}),
	}),
};

export const db = new Kysely<DB>(databaseConfig);
