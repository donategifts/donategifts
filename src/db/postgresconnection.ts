import genFunc from 'connect-pg-simple';
import session from 'express-session';
import { Kysely, KyselyConfig, PostgresDialect } from 'kysely';
import { Pool } from 'pg';

import config from '../helper/config';
import logger from '../helper/logger';

import { DB } from './types/generated/database';

const databaseConfig: KyselyConfig = {
	log(event): void {
		if (event.level === 'query') {
			if (config.ENABLE_QUERY_LOGGING) {
				logger.debug(event.query.sql);
				logger.debug(JSON.stringify(event.query.parameters));
			}
		} else if (event.level === 'error') {
			logger.error(event);
		}
	},
	dialect: new PostgresDialect({
		pool: new Pool({
			host: config.PG_HOST,
			port: config.PG_PORT,
			user: config.PG_USER,
			password: config.PG_PASSWORD,
			database: config.PG_DATABASE,
		}),
	}),
};

export const database = new Kysely<DB>(databaseConfig);

export const connectPostgres = async () => {
	const tables = await database.introspection.getTables({
		withInternalKyselyTables: false,
	});

	if (tables.length === 0) {
		logger.error('Database initialized with 0 tables, check your database connection!');
	} else {
		logger.info(`Database initialized with ${tables.length} tables`);
	}

	const PostgresqlStore = genFunc(session);
	const sessionStore = new PostgresqlStore({
		conObject: {
			database: config.PG_DATABASE,
			host: config.PG_HOST,
			user: config.PG_USER,
			password: config.PG_PASSWORD,
			port: config.PG_PORT,
		},
	});

	return sessionStore;
};
