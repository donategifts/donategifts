// eslint-disable-next-line import/no-unresolved
import { Express } from 'express-serve-static-core';

import User from '../src/db/models/User';

declare module 'express-serve-static-core' {
	interface Request {
		rawBody: paypal.notification.webhookEvent.WebhookEvent;
		file: Express.Multer.File &
			Express.MulterS3.File & {
				Location: string;
			};
		files: { [fieldname: string]: Express.Multer.File[] };
	}

	interface Locals {
		user: User;
	}

	interface Response {
		locals: Locals;
	}
}
