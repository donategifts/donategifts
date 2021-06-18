import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';
import { userMutations } from './mutations/user';
import { IContext } from './types/Context';
import { UserType, userService } from './query';

export const generateSchema = (): GraphQLSchema => {
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: UserType,
        args: {
          id: { type: GraphQLInt },
        },
        resolve: async (_parent, { id }, context: IContext) =>
          userService.getUser({ context, id }),
      },
      allUsers: {
        type: GraphQLList(UserType),
        args: {
          limit: { type: GraphQLInt },
        },
        resolve: async (_parent, { limit = 10 }, context: IContext) =>
          userService.getAllUsers({ context, limit }),
      },
    },
  });

  const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
      login: {
        type: UserType,
        args: {
          email: { type: GraphQLNonNull(GraphQLString) },
          password: { type: GraphQLNonNull(GraphQLString) },
        },
        resolve: async (_parent, { email, password }, context: IContext) =>
          userMutations.login({ context, email, password }),
      },
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
