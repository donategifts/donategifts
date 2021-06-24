import { GraphQLList, GraphQLInt, GraphQLString } from 'graphql';
import Query from '../../generator/query';
import { handlePrismaError } from '../../helper/prismaErrorHandler';
import { IContext } from '../../types/Context';

export const getAllUsers = new Query({
  name: 'GetAllUsers',

  type: GraphQLList,

  description: '',

  attributes: [
    {
      name: 'id',
      roles: ['admin'],
      type: GraphQLInt,
      description: 'Id of the user entry',
    },
    {
      name: 'firstName',
      roles: ['admin'],
      type: GraphQLString,
      description: 'The users firstName',
    },
    {
      name: 'lastName',
      roles: ['admin'],
      type: GraphQLString,
      description: 'The users lastName',
    },
    {
      name: 'profileImage',
      roles: ['admin'],
      type: GraphQLString,
      description: 'Profile image of the user',
    },
    {
      name: 'email',
      roles: ['admin'],
      type: GraphQLString,
      description: 'Email address of the user',
    },
    {
      name: 'role',
      roles: ['admin'],
      type: GraphQLString,
      description: 'The users role in the system',
    },
    {
      name: 'loginMode',
      roles: ['admin'],
      type: GraphQLString,
      description: 'The users login mode => Facebook/Google/Email',
    },
  ],

  args: {
    limit: { type: GraphQLInt },
  },

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
