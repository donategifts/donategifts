// eslint-disable-next-line import/no-unresolved
import { Express } from 'express-serve-static-core';
import { Selectable } from 'kysely';

import { Users } from '../src/db/types/generated/database';

declare module 'express-serve-static-core' {
	interface Request {
		rawBody: string;
		file: Express.Multer.File &
			Express.MulterS3.File & {
				Location: string;
			};
		files: {
			[fieldname: string]: [
				Express.Multer.File[] & {
					Location: string;
					filename: string;
				},
			];
		};
	}

	interface Locals {
		user: Selectable<Users>;
	}

	interface Response {
		locals: Locals;
	}
}
