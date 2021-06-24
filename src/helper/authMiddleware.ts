import { Request, Response, NextFunction } from 'express';
import { extractTokenFromAuthorization } from './jwt';

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
): void => {
  req.user = {};

  if (req.headers && req.headers.authorization) {
    const decoded = extractTokenFromAuthorization(req.headers.authorization);

    if (decoded && !decoded.isRefreshToken) {
      const { email, role } = decoded;

      req.user = {
        email,
        role,
      };
    }
  } else {
    req.user = {
      role: 'guest',
    };
  }

  return next();
};
