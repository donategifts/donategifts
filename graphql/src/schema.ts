import {
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
} from 'graphql';
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
        resolve: async (_parent, _args, context: IContext) =>
          userService.getAllUsers({ context }),
      },
    },
  });

  const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({}),
  });

  const subscriptionType = new GraphQLObjectType({
    name: 'Subscription',
    fields: () => ({}),
  });

  return new GraphQLSchema({
    query: queryType,
    // mutation: mutationType,
    // subscription: subscriptionType,
  });
};
