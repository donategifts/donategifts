import { PrismaClient } from '@prisma/client';

export interface IContext {
  req: Express.Request;
  userRoles: string[];
  isDeveloper: boolean;
  customerSessionId: string;
  prisma: PrismaClient;
}
