import * as jwt from 'jsonwebtoken';
import { ITokenPayLoad } from '../types/JWT';

import { CustomError } from './customError';
import { logger } from './logger';

export const {
  JWT_SECRET,
  JWT_TOKEN_EXPIRES_IN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} = process.env;
export const JWT_ALGORITHM = 'HS256';

export const decodeToken = (
  token: string,
  throwOnExpired = true,
  quiet = false,
): ITokenPayLoad => {
  let decoded = {} as ITokenPayLoad;

  try {
    decoded = jwt.verify(token, JWT_SECRET!, {
      algorithms: [JWT_ALGORITHM],
    }) as ITokenPayLoad;
  } catch (err) {
    if (throwOnExpired && err instanceof jwt.TokenExpiredError) {
      throw new CustomError({
        message: 'Token expired',
        code: 'AuthorizationTokenExpiredError',
        status: 401,
      });
    }

    if (!quiet) {
      logger.error(`${err.message}: ${token}`);
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
      code: 'AuthorizationHeaderError',
    });
  }

  const [scheme, token] = authHeaderParts;

  if (scheme.toUpperCase() !== 'JWT') {
    throw new CustomError({
      message: `Unknown authorization scheme used: ${scheme}`,
      code: 'AuthorizationHeaderError',
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
      const { id, firstName, lastName, role, customerSessionId } = decoded;

      const isDeveloper = role === 'developer';

      params.user = {
        id,
        firstName,
        lastName,
        role,
        isDeveloper,
        customerSessionId,
      };
    }
  }
};

export const generateCustomToken = (
  tokenPayload: ITokenPayLoad,
  subject: string,
  tokenExpiresIn = JWT_TOKEN_EXPIRES_IN,
): { token: string } => {
  const jwtBaseOptions: jwt.SignOptions = {
    algorithm: JWT_ALGORITHM,
    issuer: 'batch',
    subject,
    expiresIn: tokenExpiresIn!,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET!, jwtBaseOptions);

  return { token };
};
