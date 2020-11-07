/* eslint-disable @typescript-eslint/naming-convention */
import { ISessionUser } from '../src/common';

declare global {
  namespace Express {
    interface Session {
      user: ISessionUser;
    }
  }
}
