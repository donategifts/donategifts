import { ApolloServer, makeExecutableSchema } from 'apollo-server';
import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

new ApolloServer({
  schema: makeExecutableSchema({
    typeDefs: readFileSync(join(__dirname, './schema.gql'), {
      encoding: 'utf-8',
    }),
  }),
  context: {
    prisma,
  },
}).listen({ port: 4000 }, () =>
  console.log(`
      🚀 Server ready at: http://localhost:4000
    `),
);
