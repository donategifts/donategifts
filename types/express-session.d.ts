import 'express-session';
import { Selectable } from 'kysely';

import { Users } from '../src/db/types/generated/database';

declare module 'express-session' {
    interface SessionData {
        user: Selectable<Users>;
    }
}
