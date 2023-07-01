import User from '../server/db/models/User';

import 'express-session';

declare module 'express-session' {
	interface SessionData {
		user: User;
	}
}
