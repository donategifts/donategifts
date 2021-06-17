import { PrismaClient } from '@prisma/client';

export interface IContext {
  req: any;
  userId: number;
  userRoles: string[];
  isDeveloper: boolean;
  customerSessionId: string;
  prisma: PrismaClient;
}
