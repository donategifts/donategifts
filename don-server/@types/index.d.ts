import { ISession } from '../src/common/express/Session';

declare global {
  export var io: any;
  namespace Express {
    export interface Request {
      session: ISession;
    }
  }
}
