import { compareSync } from 'bcrypt';
import { GraphQLInt, GraphQLString, GraphQLNonNull } from 'graphql';
import { user as User } from '@prisma/client';
import Mutation from '../../generator/mutation';
import { CustomError } from '../../helper/customError';
import { generateCustomToken, JWT_TOKEN_EXPIRES_IN } from '../../helper/jwt';
import { handlePrismaError } from '../../helper/prismaErrorHandler';
import { IContext } from '../../types/Context';

export const login = new Mutation({
  name: 'Login',

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
    {
      name: 'jwt',
      roles: ['admin', 'guest'],
      type: GraphQLString,
      description: 'JWT',
    },
  ],

  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: async (_parent, { email, password }, context: IContext) => {
    let result: User | null;
    try {
      result = await context.prisma.user.findFirst({
        where: {
          email,
        },
      });
    } catch (error) {
      throw handlePrismaError(error);
    }

    if (!result) {
      throw new CustomError({
        message: 'Failed to authenticate user',
        code: 'NoUserFoundError',
        status: 401,
      });
    }

    const passwordMatch = compareSync(password, result.password);

    if (passwordMatch) {
      const { token } = generateCustomToken(
        {
          email,
          role: result.role,
        },
        'login',
        JWT_TOKEN_EXPIRES_IN,
      );

      return { ...result, jwt: token };
    }

    throw new CustomError({
      message: 'Passwords do not match',
      code: 'PasswordMissMatchError',
      status: 401,
    });
  },
});
