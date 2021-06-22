import { compareSync } from 'bcrypt';
import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
} from 'graphql';
import { user as User } from '@prisma/client';
import Mutation from '../../generator/mutation';
import { DateTime } from '../../graphTypes';
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
      roles: ['guest'],
      type: GraphQLInt,
      description: 'Id of the user entry',
    },
    {
      name: 'firstName',
      roles: ['guest'],
      type: GraphQLString,
      description: 'The users firstName',
    },
    {
      name: 'lastName',
      roles: ['guest'],
      type: GraphQLString,
      description: 'The users lastName',
    },
    {
      name: 'profileImage',
      roles: [],
      type: GraphQLString,
      description: 'Profile image of the user',
    },
    {
      name: 'email',
      roles: [],
      type: GraphQLString,
      description: 'Email address of the user',
    },
    {
      name: 'emailVerified',
      roles: [],
      type: GraphQLBoolean,
      description:
        'Boolean value to check if user has a verified email address',
    },
    {
      name: 'emailVerificationHash',
      roles: [],
      type: GraphQLString,
      description: 'Verification hash of the email',
    },
    {
      name: 'role',
      roles: [],
      type: GraphQLString,
      description: 'The users role in the system',
    },
    {
      name: 'loginMode',
      roles: [],
      type: GraphQLString,
      description: 'The users login mode => Facebook/Google/Email',
    },
    {
      name: 'password',
      roles: [],
      type: GraphQLString,
      description: 'User password',
    },
    {
      name: 'passwordResetToken',
      roles: [],
      type: GraphQLString,
      description: 'User password reset token',
    },
    {
      name: 'passwordResetTokenExpires',
      roles: [],
      type: DateTime,
      description: 'Time window in which the token expires',
    },
    {
      name: 'createdAt',
      roles: [],
      type: DateTime,
      description: 'Timestamp',
    },
    {
      name: 'updatedAt',
      roles: [],
      type: DateTime,
      description: 'Timestamp',
    },
    {
      name: 'deletedAt',
      roles: [],
      type: DateTime,
      description: 'Timestamp',
    },
    { name: 'jwt', roles: [], type: GraphQLString, description: 'JWT' },
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
