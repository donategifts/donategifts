import 'reflect-metadata';
import { config } from 'dotenv';
import * as cors from 'cors';
import * as path from 'path';
import * as express from 'express';
import * as basicAuth from 'express-basic-auth';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as connectMongo from 'connect-mongo';
import { logger } from '@donategifts/helper';
import { MongooseConnection } from '@donategifts/db-connection';
import { ExpressHelpers } from '@donategifts/webservice-helper';
import { connectSocket } from './helper/socket';
import { RegisterRoutes } from './routes/routes';

// load from config if not production, otherwise use from docker
if (process.env.NODE_ENV !== 'production') {
	let configPath = path.join(__dirname, '../../../config/config.env');

	if (process.env.NODE_ENV === 'test') {
		configPath = path.join(__dirname, '../../../config/test.config.env');
	}

	config({
		path: configPath,
	});
}

const app = express();

const bootServer = async () => {
	await MongooseConnection.connect();
	const MongoStore = connectMongo(session);

	// SESSION SET UP
	app.use(
		session({
			store: new MongoStore({
				url: String(process.env.MONGO_URI),
				autoRemoveInterval: 3600000,
			}),
			name: process.env.SESS_NAME,
			resave: false,
			saveUninitialized: false,
			secret: String(process.env.SESS_SECRET),
			cookie: {
				maxAge: Number(process.env.SESS_LIFE), // cookie set to expire in 1 hour
				sameSite: true,
				secure: process.env.NODE_ENV === 'production',
			},
		}),
	);

	app.use(ExpressHelpers.middleWare.extractSessionUser);
	app.use(ExpressHelpers.middleWare.requestLogger);
	app.use(ExpressHelpers.middleWare.healthCheck());

	// PARSERS SET UP
	app.use(bodyParser.json());
	app.use(
		bodyParser.urlencoded({
			extended: true,
		}),
	);

	// sanitize input data for mongo
	// replace with _ so that we cannot write it to db
	app.use(
		mongoSanitize({
			replaceWith: '_',
		}),
	);

	app.use(cookieParser());

	global.io = connectSocket(app);

	// MOUNT ROUTERS
	RegisterRoutes(app);

	app.get('/website-api', (_req: express.Request, res: express.Response) => {
		res.send(
			`
				<html lang="en">
					<head>
					<title>Status Page</title>
						<meta name="viewport" content="width=device-width, initial-scale=1">
					</head>
					<body>
					  <h1></div>website-api</h1>
					  Environment: ${process.env.NODE_ENV}<br>
					  Version: ${process.env.npm_package_version} (${process.env.RELEASE})<br>
					  <br>
					  <a href="/website-api/openapi.yaml" target="_blank">OpenApi3 Definition</a> (Open <a target="_blank" href="https://editor.swagger.io/?url=https://donate-gifts.com/website-api/openapi.yaml">editor.swagger.io</a>)<br>
					  <br>
						<hr>
					  <small>${process.env.npm_package_name} - ${new Date().toLocaleString()}</small>
					</body>
				</html>
			`,
		);
	});

	app.get(
		'/website-api/openapi.yaml',
		cors<express.Request>(),
		basicAuth({
			users: {
				hurrdurrpurr: 'camelCaseWithCamelToe',
			},
			challenge: true,
			realm: 'website-api-doc',
		}),
		(_req: express.Request, res: express.Response) => {
			res.sendFile(path.resolve(__dirname, './swagger/swagger.yaml'));
		},
	);

	// error handler
	app.use(
		(
			err: { message: any; toString: () => any },
			req: express.Request,
			res: express.Response,
			_next: express.NextFunction,
		) => {
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// TODO: send error messaging to slack/sentry?

			logger.error(err);

			res.status(500).send({
				message: err.toString(),
			});
		},
	);
};

bootServer().catch((err) => {
	logger.error(err);
	process.exit(1);
});

// catch unhandledRejections here and log them
process.on('unhandledRejection', (error, promise) => {
	logger.error('Unhandled rejection in', error, error && (error as any).stack, promise);
});

export { app };
