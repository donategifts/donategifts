import { IUser } from '../user';
import { TypeObjectId } from '../generic';

export interface ISessionUser {
	_id: TypeObjectId<IUser>;
	userRole: 'partner' | 'donor';
}

export interface ISession {
	user: ISessionUser | null;
	agency: any;
}
