import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_ALGORITHM, JWT_SECRET } from './jwt';
import { logger } from './logger';

export const forwardAuthEndpoint = async (
  req: Request,
  res: Response,
): Promise<any> => {
  const { carrier } = req.query;

  logger.log(`executing auth-check for carrier: ${carrier}`);

  const path = String(req.headers['x-forwarded-uri']);
  const token = String(path?.split('/').pop());

  try {
    jwt.verify(token, JWT_SECRET!, { algorithms: [JWT_ALGORITHM] });
  } catch (_error) {
    return res.status(403).send();
  }

  return res.status(200).send();
};
