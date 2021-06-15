import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { readFileSync } from 'fs';
import { join } from 'path';

new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, './schema.gql'), {
      encoding: 'utf-8',
    }),
  }),
  context: {},
}).listen({ port: 4000 }, () =>
  console.log(`
      🚀 Server ready at: http://localhost:4000
    `),
);
