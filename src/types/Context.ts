import { PrismaClient, user_role } from '@prisma/client';

export type Roles = user_role | 'guest';

export interface IContext {
  req: Express.Request;
  userRole: Roles;
  prisma: PrismaClient;
}
