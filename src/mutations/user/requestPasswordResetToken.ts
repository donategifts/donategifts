import { add } from 'date-fns';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { v4 as uuidV4 } from 'uuid';
import Mutation from '../../generator/mutation';
import { CustomError } from '../../helper/customError';
import { handlePrismaError } from '../../helper/prismaErrorHandler';
import { IContext } from '../../types/Context';

export const requestPasswordResetToken = new Mutation({
  name: 'RequestPasswordResetToken',

  description: '',

  attributes: [
    {
      name: 'resetToken',
      description: '',
      type: GraphQLString,
      roles: ['admin'],
    },
  ],

  args: {
    resetToken: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },

  resolve: async (_parent, { email }, context: IContext) => {
    try {
      const result = await context.prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (result) {
        if (result.passwordResetToken && result.passwordResetTokenExpires) {
          const now = new Date();
          if (result.passwordResetTokenExpires > now) {
            return { resetToken: result.passwordResetToken };
          }
        }

        const resetToken = uuidV4();
        const tokenExpires = add(new Date(), {
          minutes: 15,
        });

        await context.prisma.user.update({
          where: {
            email,
          },
          data: {
            passwordResetToken: resetToken,
            passwordResetTokenExpires: tokenExpires,
          },
        });

        return resetToken;
      }

      throw new CustomError({
        message: 'No user found with given email',
        code: 'UserNotFound',
        status: 400,
      });
    } catch (error) {
      throw handlePrismaError(error);
    }
  },
});
