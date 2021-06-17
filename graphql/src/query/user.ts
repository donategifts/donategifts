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
      console.error(error);
      throw new CustomError(
        `Failed to fetch user with id ${id}`,
        'UserFetchError',
      );
    }
  },
  getAllUsers: async ({ context }: { context: IContext }): Promise<user[]> => {
    try {
      return await context.prisma.user.findMany();
    } catch (error) {
      throw new CustomError(`Failed to fetch all users`, 'UsersFetchError');
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
  createdAt: { type: DateTime, description: 'User password' },
  updatedAt: { type: DateTime, description: 'User password' },
  deletedAt: { type: DateTime, description: 'User password' },
});

export const UserType = new GraphQLObjectType({
  name: 'User',
  fields: resolveUserFields(),
});
