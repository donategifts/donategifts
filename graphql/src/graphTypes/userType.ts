import {
  GraphQLInt,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
} from 'graphql';
import { DateTime } from './dateTimeType';

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
