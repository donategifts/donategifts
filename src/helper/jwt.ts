import * as jwt from 'jsonwebtoken';
import { ITokenPayLoad } from '../types/JWT';

import { CustomError } from './customError';
import { logger } from './logger';

export const { JWT_SECRET, JWT_TOKEN_EXPIRES_IN } = process.env;
export const JWT_ALGORITHM = 'HS256';

export const decodeToken = (
  token: string,
  throwOnExpired = true,
  quiet = false,
): ITokenPayLoad => {
  let decoded = {} as ITokenPayLoad;

  try {
    decoded = jwt.verify(token, String(JWT_SECRET), {
      algorithms: [JWT_ALGORITHM],
    }) as ITokenPayLoad;
  } catch (error) {
    if (throwOnExpired && error instanceof jwt.TokenExpiredError) {
      throw new CustomError({
        message: 'Token expired',
        code: 'AuthorizationTokenExpiredError',
        status: 401,
        error,
      });
    }

    if (!quiet) {
      logger.error(`${error.message}: ${token}`);
    }
  }

  return decoded;
};

export const extractTokenFromAuthorization = (
  authHeader: string,
): ITokenPayLoad | null => {
  const authHeaderParts = authHeader.split(' ');

  if (authHeaderParts.length !== 2) {
    throw new CustomError({
      message: "Authorization header format is: 'Authorization: JWT [token]'",
      code: 'AuthorizationHeaderFormatError',
    });
  }

  const [scheme, token] = authHeaderParts;

  if (scheme.toUpperCase() !== 'JWT') {
    throw new CustomError({
      message: `Unknown authorization scheme used: ${scheme}`,
      code: 'AuthorizationHeaderSchemeError',
    });
  }

  const decoded = decodeToken(token, true);

  if (decoded && !decoded.isRefreshToken) {
    return decoded;
  }

  if (!decoded) {
    throw new CustomError({
      message: `Invalid token used: ${token}`,
      code: 'AuthorizationTokenError',
      status: 401,
    });
  }

  return null;
};

export const wsAuthMiddleware = (params: {
  user: ITokenPayLoad;
  authorization: string;
}): void => {
  params.user = {} as ITokenPayLoad;

  if (params.authorization) {
    const decoded = extractTokenFromAuthorization(params.authorization);
    if (decoded && !decoded.isRefreshToken) {
      const { id, firstName, lastName, role } = decoded;

      params.user = {
        id,
        firstName,
        lastName,
        role,
      };
    }
  }
};

export const generateCustomToken = (
  tokenPayload: ITokenPayLoad,
  subject: string,
  tokenExpiresIn = String(JWT_TOKEN_EXPIRES_IN),
): { token: string } => {
  const jwtBaseOptions: jwt.SignOptions = {
    algorithm: JWT_ALGORITHM,
    issuer: 'donategifts',
    subject,
    expiresIn: tokenExpiresIn,
  };

  const token = jwt.sign(tokenPayload, String(JWT_SECRET), jwtBaseOptions);

  return { token };
};
