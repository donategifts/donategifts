import { GraphQLScalarType } from 'graphql';

export const DateTime = new GraphQLScalarType({
  name: 'DateTime',
  serialize(value) {
    return new Date(value);
  },
});
