import { GraphQLInt, GraphQLList } from 'graphql';
import Query from '../generator/query';
import { UserType } from '../graphTypes';
import { handlePrismaError } from '../helper/prismaErrorHandler';
import { IContext } from '../types/Context';

export const getUser = new Query({
  name: 'getUser',
  type: UserType,
  args: {
    id: { type: GraphQLInt },
  },
  description: '',
  resolve: async (_parent, { id }, context: IContext) => {
    try {
      return await context.prisma.user.findFirst({
        where: {
          id: parseInt(id, 10),
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  },
});

export const getAllUsers = new Query({
  name: 'allUsers',
  type: GraphQLList(UserType),
  args: {
    limit: { type: GraphQLInt },
  },
  description: '',
  resolve: async (_parent, { limit = 10 }, context: IContext) => {
    try {
      return await context.prisma.user.findMany({
        take: limit,
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  },
});
