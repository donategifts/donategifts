import type { IDBUser } from '../user';
import type { TypeObjectId } from '../generic';

export interface ISessionUser {
  _id: TypeObjectId<IDBUser>;
  userRole: 'partner' | 'donor';
}

export interface ISession {
  user: ISessionUser | null;
  agency: any;
}
