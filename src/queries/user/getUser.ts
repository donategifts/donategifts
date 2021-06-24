import { GraphQLInt, GraphQLString } from 'graphql';
import Query from '../../generator/query';
import { handlePrismaError } from '../../helper/prismaErrorHandler';
import { IContext } from '../../types/Context';

export const getUser = new Query({
  name: 'GetUser',

  description: '',

  attributes: [
    {
      name: 'id',
      roles: ['admin', 'guest'],
      type: GraphQLInt,
      description: 'Id of the user entry',
    },
    {
      name: 'firstName',
      roles: ['admin', 'guest'],
      type: GraphQLString,
      description: 'The users firstName',
    },
    {
      name: 'lastName',
      roles: ['admin', 'guest'],
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
    id: { type: GraphQLInt },
  },

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
