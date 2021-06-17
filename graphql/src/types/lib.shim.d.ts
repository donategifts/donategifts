/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  export interface Request {
    user: {
      id?: number;
      username?: string;
      firstName?: string;
      lastName?: string;
      roles?: string | string[];
      isDeveloper?: boolean;
      customerSessionId?: string;
    };
  }
}
