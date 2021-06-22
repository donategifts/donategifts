import { user as User, user_role } from '@prisma/client';
import { compareSync, hashSync } from 'bcrypt';
import { v4 as uuidV4 } from 'uuid';
import { add } from 'date-fns';
import { GraphQLNonNull, GraphQLString } from 'graphql';
import { handlePrismaError } from '../helper/prismaErrorHandler';
import { IContext } from '../types/Context';
import { CustomError } from '../helper/customError';
import { generateCustomToken, JWT_TOKEN_EXPIRES_IN } from '../helper/jwt';
import Mutation from '../generator/mutation';
import { ResetTokenType, UserType } from '../graphTypes';

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS);

export const login = new Mutation({
  name: 'login',
  type: UserType,
  description: '',
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

    const pwMatch = compareSync(password, result.password);

    if (pwMatch) {
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

export const register = new Mutation({
  name: 'register',
  type: UserType,
  args: {
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    firstName: { type: GraphQLNonNull(GraphQLString) },
    lastName: { type: GraphQLNonNull(GraphQLString) },
    loginMode: { type: GraphQLNonNull(GraphQLString) },
  },
  description: '',
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

export const requestPasswordResetToken = new Mutation({
  name: 'requestPasswordResetToken',
  type: ResetTokenType,
  args: {
    resetToken: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  description: '',
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

        return { resetToken };
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

export const resetPassword = new Mutation({
  name: 'resetPassword',
  type: UserType,
  args: {
    resetToken: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
  },
  description: '',
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
