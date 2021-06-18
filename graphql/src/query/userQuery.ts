import { user } from '@prisma/client';
import { CustomError } from '../helper/customError';
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
      throw new CustomError({
        message: `Failed to fetch user with id ${id}`,
        code: 'UserFetchError',
        error,
      });
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
      throw new CustomError({
        message: `Failed to fetch all users`,
        code: 'UsersFetchError',
        error,
      });
    }
  },
};
