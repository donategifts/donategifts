import { GraphQLObjectType, GraphQLString } from 'graphql';

export const ResetTokenType = new GraphQLObjectType({
  name: 'ResetToken',
  fields: {
    resetToken: { type: GraphQLString },
  },
});
