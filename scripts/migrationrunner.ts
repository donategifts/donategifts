import fs from 'node:fs/promises';
import path from 'node:path';

import { Kysely, Migrator, PostgresDialect, FileMigrationProvider } from 'kysely';
import { Pool } from 'pg';

import { DB } from '../src/db/types/generated/database';
import config from '../src/helper/config';

(async () => {
	const db = new Kysely<DB>({
		dialect: new PostgresDialect({
			pool: new Pool({
				host: config.PG_HOST,
				port: config.PG_PORT,
				user: config.PG_USER,
				password: config.PG_PASSWORD,
				database: config.PG_DATABASE,
			}),
		}),
	});

	const migrator = new Migrator({
		db,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, '../migrations'),
		}),
	});

	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === 'Success') {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === 'Error') {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error('failed to migrate');
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
})();
