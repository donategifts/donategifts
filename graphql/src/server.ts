import * as cors from 'cors';
import * as express from 'express';
import { ApolloServer, ApolloError } from 'apollo-server-express';
import { PrismaClient } from '@prisma/client';
import { CustomError } from './helper/customError';
import { generateSchema } from './schema';
import { wsAuthMiddleware } from './helper/jwt';
import { pubsub } from './helper/pubSub';
import { authMiddleware } from './helper/authMiddleware';
import { forwardAuthEndpoint } from './helper/wsMiddleware';
import { loadEnv } from './loadEnv';

loadEnv();

const prisma = new PrismaClient();

const isProductionMode = process.env.NODE_ENV === 'production';

const server = new ApolloServer({
  schema: generateSchema(),
  introspection: !isProductionMode,
  playground: false,
  context: ({ req }) => {
    const userRoles = req.user.roles;
    const { isDeveloper, customerSessionId } = req.user;

    return {
      ...req,
      user: req.user,
      userRoles,
      isDeveloper,
      customerSessionId,
      prisma,
    };
  },
  subscriptions: {
    onConnect: (params, _ws, context) => {
      try {
        wsAuthMiddleware(params as any);
      } catch (e) {
        console.error(`WS client connected error: ${e.message}`);
        throw e;
      }

      const { user } = params as any;
      if (user) {
        const userRoles = user.roles;
        const { isDeveloper } = user;
        const { customerSessionId } = user;
        return {
          ...context,
          pubsub,
          userRoles,
          isDeveloper,
          customerSessionId,
        };
      }
      return {
        ...context,
        pubsub,
      };
    },
  },
  formatError: (err) => {
    if (err.originalError) {
      const { message, code, meta } = err.originalError as CustomError;

      const { locations, path } = err;

      console.error(err.originalError);

      return {
        ...new ApolloError(message, code, { meta }),
        message,
        locations,
        path,
      };
    }

    console.error(err);

    return err;
  },
  formatResponse: (response, { context }: any) => {
    // prevent introspection for anonymous users
    // if (
    //   !userId &&
    //   response.data &&
    //   (response.data.__schema || response.data.__type)
    // ) {
    //   delete response.data.__schema;
    //   delete response.data.__type;
    // }

    console.log('formatResponse', context.user);

    return response;
  },
});

export const boot = async (): Promise<void> =>
  new Promise(() => {
    const app = express();

    app.use(cors());

    app.all('/forward-auth', forwardAuthEndpoint);

    app.use(authMiddleware as any);

    app.use('/graphiql', (req, res) => {
      res.send(`
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body {
                  height: 100%;
                  margin: 0;
                  width: 100%;
                  overflow: hidden;
                }

                #graphiql {
                  height: 100vh;
                }
              </style>
              <script
                crossorigin
                src="https://unpkg.com/react@16/umd/react.development.js"
              ></script>
              <script
                crossorigin
                src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"
              ></script>
              <link rel="stylesheet" href="https://unpkg.com/graphiql/graphiql.min.css" />
            </head>
            <body>
              <div id="graphiql">Loading...</div>
              <script
                src="https://unpkg.com/graphiql/graphiql.min.js"
                type="application/javascript"
              ></script>
              <script>
                function graphQLFetcher(graphQLParams) {
                  return fetch(
                    'http://localhost:4000/graphql',
                    {
                      method: 'post',
                      headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(graphQLParams),
                      credentials: 'omit',
                    },
                  ).then(function (response) {
                    return response.json().catch(function () {
                      return response.text();
                    });
                  });
                }
                ReactDOM.render(
                  React.createElement(GraphiQL, {
                    fetcher: graphQLFetcher,
                    defaultVariableEditorOpen: true,
                  }),
                  document.getElementById('graphiql'),
                );
              </script>
            </body>
          </html>
        `);
    });

    // eslint-disable-next-line no-unused-vars
    app.use(
      (
        err: CustomError,
        _req: express.Request,
        res: express.Response,
        _next: express.NextFunction,
      ) => {
        res.send({
          errors: [new ApolloError(err.message, err.code, { meta: err.meta })],
        });
      },
    );

    const port = parseInt(process.env.PORT!, 10);

    server.applyMiddleware({ app });

    app.listen(port, () => {
      console.log(`Listening on port ${port} ... 🚀`);
      console.log(
        `Server ready at http://localhost:${port}${server.graphqlPath}`,
      );
      console.log(
        `Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,
      );
    });
  });
