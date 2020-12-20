import type { IUser } from '../user';
import type { TypeObjectId } from '../generic';

export interface ISessionUser {
	_id: TypeObjectId<IUser>;
	userRole: 'partner' | 'donor';
}

export interface ISession {
	user: ISessionUser | null;
	agency: any;
}
