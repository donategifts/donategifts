// eslint-disable-next-line import/no-unresolved
import { Express } from 'express-serve-static-core';

import User from '../src/db/models/User';

declare module 'express-serve-static-core' {
	interface Request {
		rawBody: string;
		file: Express.Multer.File & Express.MulterS3.File;
	}

	interface Locals {
		user: User;
	}

	interface Response {
		locals: Locals;
	}
}
