import { Request, Response, NextFunction } from 'express';
import { extractTokenFromAuthorization } from './jwt';

export const authMiddleware = (
  req: Request & {
    user: {
      id?: number;
      username?: string;
      firstName?: string;
      lastName?: string;
      roles?: string;
      isDeveloper?: boolean;
      customerSessionId?: string;
    };
  },
  _res: Response,
  next: NextFunction,
): void => {
  req.user = {};

  if (req.headers && req.headers.authorization) {
    const decoded = extractTokenFromAuthorization(req.headers.authorization);
    if (decoded && !decoded.isRefreshToken) {
      const { id, username, firstName, lastName, roles, customerSessionId } =
        decoded;

      const isDeveloper = roles ? roles.includes('developer') : false;

      req.user = {
        id,
        username,
        firstName,
        lastName,
        roles: roles || [],
        isDeveloper,
        customerSessionId,
      };
    }
  }

  next();
};
