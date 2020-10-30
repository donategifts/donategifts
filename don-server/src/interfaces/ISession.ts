import { TypeObjectId } from './IGeneric';

export interface ISessionUser {
  _id: TypeObjectId<string>;
  userRole: 'partner' | 'donor';
}

export interface ISession {
  user: ISessionUser;
  agency: any;
}
