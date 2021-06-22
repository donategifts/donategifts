import { PrismaClient } from '@prisma/client';

export interface IContext {
  req: Express.Request;
  userRole: string;
  isDeveloper: boolean;
  customerSessionId: string;
  prisma: PrismaClient;
}
