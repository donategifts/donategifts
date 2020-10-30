import { ISession } from '../src/interfaces/ISession';

declare global {
  export var io: any;
  namespace Express {
    export interface Request {
      session: ISession;
    }
  }
}
