import { user } from '@prisma/client';
import { handlePrismaError } from '../helper/prismaErrorHandler';
import { IContext } from '../types/Context';

export const userService = {
  getUser: async ({
    context,
    id,
  }: {
    context: IContext;
    id: string;
  }): Promise<user | null> => {
    try {
      return await context.prisma.user.findFirst({
        where: {
          id: parseInt(id, 10),
        },
      });
    } catch (error) {
      const err = handlePrismaError(error);
      throw err;
    }
  },
  getAllUsers: async ({
    context,
    limit,
  }: {
    context: IContext;
    limit: number;
  }): Promise<user[]> => {
    try {
      return await context.prisma.user.findMany({
        take: limit,
      });
    } catch (error) {
      const err = handlePrismaError(error);
      throw err;
    }
  },
};
