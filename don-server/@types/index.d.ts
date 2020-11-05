/* eslint-disable */
import { ISession } from '../src/common';

declare global {
  export var io: any;
  namespace Express {
    export interface Request {
      session: ISession;
    }
  }
}
