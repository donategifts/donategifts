import * as jwt from 'jsonwebtoken';
import { CustomError } from './customError';

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
): Record<string, any> => {
  let decoded: Record<string, any> = {};

  try {
    decoded = jwt.verify(token, JWT_SECRET!, {
      algorithms: [JWT_ALGORITHM],
    }) as Record<string, any>;
  } catch (err) {
    if (throwOnExpired && err instanceof jwt.TokenExpiredError) {
      throw new CustomError(
        'Token expired',
        'AuthorizationTokenExpiredError',
        401,
      );
    }

    if (!quiet) {
      console.error(`${err.message}: ${token}`);
    }
  }

  return decoded;
};

export const extractTokenFromAuthorization = (
  authHeader: string,
): Record<string, any> | null => {
  const authHeaderParts = authHeader.split(' ');

  if (authHeaderParts.length !== 2) {
    throw new CustomError(
      "Authorization header format is: 'Authorization: JWT [token]'",
      'AuthorizationHeaderError',
    );
  }

  const [scheme, token] = authHeaderParts;

  if (scheme.toUpperCase() !== 'JWT') {
    throw new CustomError(
      `Unknown authorization scheme used: ${scheme}`,
      'AuthorizationHeaderError',
    );
  }

  const decoded = decodeToken(token, true);

  if (decoded && !decoded.isRefreshToken) {
    return decoded;
  }

  if (!decoded) {
    throw new CustomError(
      `Invalid token used: ${token}`,
      'AuthorizationTokenError',
      401,
    );
  }

  return null;
};

export const wsAuthMiddleware = (params: {
  user: {
    id?: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    roles?: string;
    isDeveloper?: boolean;
    customerSessionId?: string;
  };
  authorization: string;
}): void => {
  params.user = {};

  if (params.authorization) {
    const decoded = extractTokenFromAuthorization(params.authorization);
    if (decoded && !decoded.isRefreshToken) {
      const { id, username, firstName, lastName, roles, customerSessionId } =
        decoded;

      const isDeveloper = roles ? roles.includes('developer') : false;

      params.user = {
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
};

export const generateCustomToken = (
  tokenPayload: Record<string, any>,
  subject: string,
  tokenExpiresIn = JWT_TOKEN_EXPIRES_IN,
): { token: string } => {
  const jwtBaseOptions: jwt.SignOptions = {
    algorithm: JWT_ALGORITHM,
    issuer: 'batch',
    subject,
    expiresIn: tokenExpiresIn!,
  };

  const token: string = jwt.sign(tokenPayload, JWT_SECRET!, jwtBaseOptions);

  return { token };
};
