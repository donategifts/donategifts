import fs from 'node:fs/promises';
import path from 'node:path';

(async () => {
	const name = process.argv.slice(2);

	if (!name.length) {
		throw new Error(
			'Migration name is required, e.g. npm run generate-migration-file create-users-table',
		);
	}

	// ISO 8601 date string
	const prefix = new Date().toISOString().replace(/:./g, '-');
	const migrationName = `${prefix}-${name}`;
	const migrationFile = path.join(__dirname, `../migrations/${migrationName}.ts`);

	const migrationTemplate = `import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
	// Migration code
}

export async function down(db: Kysely<any>): Promise<void> {
	// Migration code
}
`;

	await fs.writeFile(migrationFile, migrationTemplate);
})();
