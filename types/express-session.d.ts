import User from '../src/db/models/User';

import 'express-session';

declare module 'express-session' {
	interface SessionData {
		user: User;
	}
}
