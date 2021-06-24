/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      email?: string;
      role?: string;
    };
  }
}
