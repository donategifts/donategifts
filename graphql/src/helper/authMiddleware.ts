import { Request, Response, NextFunction } from 'express';
import { extractTokenFromAuthorization } from './jwt';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  req.user = {};

  console.log('----------------------- authMiddleware', req.user);

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
