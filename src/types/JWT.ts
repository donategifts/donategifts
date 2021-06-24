import { user } from '@prisma/client';

export interface ITokenPayLoad extends Partial<user> {
  isRefreshToken?: boolean;
}
