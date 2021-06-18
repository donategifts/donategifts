import {
  GraphQLBoolean,
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { user } from '@prisma/client';
import { DateTime } from '../types/GrahpQLDateTime';
import { CustomError } from '../helper/customError';
import { IContext } from '../types/Context';

export const userService = {
  getUser: async ({
    context,
    id,
  }: {
    context: IContext;
    id: string;
  }): Promise<user | null> => {
    try {
      return await context.prisma.user.findFirst({
        where: {
          id: parseInt(id, 10),
        },
      });
    } catch (error) {
      throw new CustomError({
        message: `Failed to fetch user with id ${id}`,
        code: 'UserFetchError',
        error,
      });
    }
  },
  getAllUsers: async ({
    context,
    limit,
  }: {
    context: IContext;
    limit: number;
  }): Promise<user[]> => {
    try {
      return await context.prisma.user.findMany({
        take: limit,
      });
    } catch (error) {
      throw new CustomError({
        message: `Failed to fetch all users`,
        code: 'UsersFetchError',
        error,
      });
    }
  },
};

const resolveUserFields = () => ({
  id: { type: GraphQLInt, description: 'Id of the user entry' },
  firstName: {
    type: GraphQLString,
    description: 'The users firstName',
  },
  lastName: {
    type: GraphQLString,
    description: 'The users lastName',
  },
  profileImage: {
    type: GraphQLString,
    descriptions: 'Profile image of the user',
  },
  email: {
    type: GraphQLString,
    description: 'Email address of the user',
  },
  emailVerified: {
    type: GraphQLBoolean,
    description: 'Boolean value to check if user has a verified email address',
  },
  emailVerificationHash: {
    type: GraphQLString,
    description: 'Verification hash of the email',
  },
  role: {
    type: GraphQLString,
    description: 'The users role in the system',
  },
  loginMode: {
    type: GraphQLString,
    description: 'The users login mode => Facebook/Google/Email',
  },
  password: {
    type: GraphQLString,
    description: 'User password',
  },
  passwordResetToken: {
    type: GraphQLString,
    description: 'User password reset token',
  },
  passwordResetTokenExpires: {
    type: DateTime,
    description: 'Time window in which the token expires',
  },
  createdAt: { type: DateTime, description: 'Timestamp' },
  updatedAt: { type: DateTime, description: 'Timestamp' },
  deletedAt: { type: DateTime, description: 'Timestamp' },
  jwt: { type: GraphQLString, description: 'JWT' },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: resolveUserFields(),
});
