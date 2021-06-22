import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import {
  login,
  register,
  requestPasswordResetToken,
  resetPassword,
} from './mutations';
import { getAllUsers, getUser } from './queries';

export const generateSchema = (): GraphQLSchema => {
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      getUser: getUser.createQuery(),
      getAllUsers: getAllUsers.createQuery(),
    },
  });

  const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      login: login.createMutation(),
      register: register.createMutation(),
      resetPassword: resetPassword.createMutation(),
      requestPasswordResetToken: requestPasswordResetToken.createMutation(),
    },
  });

  const subscriptionType = new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({}),
  });

  return new GraphQLSchema({
    query: queryType,
    mutation: mutationType,
    // subscription: subscriptionType,
  });
};
