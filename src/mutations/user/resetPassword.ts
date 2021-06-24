import { hashSync } from 'bcrypt';
import { GraphQLInt, GraphQLNonNull, GraphQLString } from 'graphql';
import Mutation from '../../generator/mutation';
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
