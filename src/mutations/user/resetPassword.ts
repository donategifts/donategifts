import { hashSync } from 'bcrypt';
import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLString,
} from 'graphql';
import Mutation from '../../generator/mutation';
import { DateTime } from '../../graphTypes';
import { CustomError } from '../../helper/customError';
import { handlePrismaError } from '../../helper/prismaErrorHandler';
import { IContext } from '../../types/Context';

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

export const resetPassword = new Mutation({
  name: 'ResetPassword',

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
      name: 'emailVerified',
      roles: ['admin'],
      type: GraphQLBoolean,
      description:
        'Boolean value to check if user has a verified email address',
    },
    {
      name: 'emailVerificationHash',
      roles: ['admin'],
      type: GraphQLString,
      description: 'Verification hash of the email',
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
      name: 'password',
      roles: ['admin'],
      type: GraphQLString,
      description: 'User password',
    },
    {
      name: 'passwordResetToken',
      roles: ['admin'],
      type: GraphQLString,
      description: 'User password reset token',
    },
    {
      name: 'passwordResetTokenExpires',
      roles: ['admin'],
      type: DateTime,
      description: 'Time window in which the token expires',
    },
    {
      name: 'createdAt',
      roles: ['admin'],
      type: DateTime,
      description: 'Timestamp',
    },
    {
      name: 'updatedAt',
      roles: ['admin'],
      type: DateTime,
      description: 'Timestamp',
    },
    {
      name: 'deletedAt',
      roles: ['admin'],
      type: DateTime,
      description: 'Timestamp',
    },
    { name: 'jwt', roles: ['admin'], type: GraphQLString, description: 'JWT' },
  ],

  args: {
    resetToken: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: async (_parent, { resetToken, password }, context: IContext) => {
    try {
      const result = await context.prisma.user.findUnique({
        where: {
          passwordResetToken: resetToken,
        },
      });

      if (result?.passwordResetTokenExpires) {
        const now = new Date();

        if (result.passwordResetTokenExpires >= now) {
          const hash = hashSync(password, BCRYPT_SALT_ROUNDS);
          await context.prisma.user.update({
            where: {
              id: result.id,
            },
            data: {
              password: hash,
            },
          });
        }

        return result;
      }

      throw new CustomError({
        message: 'Reset token invalid/not found',
        code: 'ResetTokenInvalidOrNotFound',
        status: 400,
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  },
});
