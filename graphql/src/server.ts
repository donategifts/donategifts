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

const prisma = new PrismaClient();

const isProductionMode = process.env.NODE_ENV === 'production';

const server = new ApolloServer({
  schema: generateSchema(),
  introspection: !isProductionMode,
  context: ({ req }) => {
    const userId = req.user.id;
    const userRoles = req.user.roles;
    const { isDeveloper, customerSessionId } = req.user;

    return {
      req,
      userId,
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
        const userId = user.id;
        const userRoles = user.roles;
        const { isDeveloper } = user;
        const { customerSessionId } = user;
        return {
          ...context,
          pubsub,
          userId,
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
  formatResponse: (response, { context: { userId, startTime } }: any) => {
    // prevent introspection for anonymous users
    if (
      !userId &&
      response.data &&
      (response.data.__schema || response.data.__type)
    ) {
      delete response.data.__schema;
      delete response.data.__type;
    }

    const timeDiff = process.hrtime(startTime);
    const runTime = timeDiff[0] * 1e3 + timeDiff[1] * 1e-6;
    console.info(
      'Time: %s ms',
      runTime.toFixed(3).replace(/(\d)(?=(\d{3})+\.)/g, '$1,'),
    );

    return response;
  },
});

export const boot = async (): Promise<void> =>
  new Promise(() => {
    const app = express();

    app.use(cors());

    app.all('/forward-auth', forwardAuthEndpoint);

    app.use(authMiddleware as any);

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
