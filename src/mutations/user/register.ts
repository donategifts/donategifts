import { user_role } from '@prisma/client';
import { hashSync } from 'bcrypt';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Mutation from '../../generator/mutation';
import { handlePrismaError } from '../../helper/prismaErrorHandler';
import { IContext } from '../../types/Context';

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

export const register = new Mutation({
  name: 'Register',

  description: '',

  attributes: [
    {
      name: 'id',
      roles: ['admin', 'guest'],
      type: GraphQLInt,
      description: 'Id of the user entry',
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
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    loginMode: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: async (
    _parent,
    { email, password, firstName, lastName, loginMode },
    context: IContext,
  ) => {
    const hash = hashSync(password, BCRYPT_SALT_ROUNDS);
    try {
      return await context.prisma.user.create({
        data: {
          firstName,
          lastName,
          email,
          loginMode,
          password: hash,
          role: user_role.donor,
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  },
});
