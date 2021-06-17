import { GraphQLObjectType, GraphQLSchema } from 'graphql';

export const generateSchema = (): GraphQLSchema => {
  const queryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({}),
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
    mutation: mutationType,
    subscription: subscriptionType,
  });
};
