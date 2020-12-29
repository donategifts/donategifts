/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */
import 'reflect-metadata';
import { config } from 'dotenv';
import * as cors from 'cors';
import * as path from 'path';

// EXPRESS SET UP
import * as express from 'express';
import * as basicAuth from 'express-basic-auth';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as connectMongo from 'connect-mongo';

// custom
import { connectSocket, logger } from '@donategifts/helper';
import { UserRepository } from '@donategifts/user';
import { AgencyRepository } from '@donategifts/agency';
import { MongooseConnection } from '@donategifts/db-connection';
import { RegisterRoutes } from './routes/routes';

// load from config if not production, otherwise use from docker
if (process.env.NODE_ENV !== 'production') {
	let configPath = path.join(__dirname, '../config/config.env');

	if (process.env.NODE_ENV === 'test') {
		configPath = path.join(__dirname, '../config/test.config.env');
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

	// log all requests
	app.use((req: express.Request, _res: express.Response, next: express.NextFunction) => {
		logger.info({
			method: req.method,
			ip: req.ip,
			url: req.url,
		});
		next();
	});

	// MIDDLEWARE for extracting user and agency from a session
	app.use(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
		if (req.session) {
			const { user } = req.session;
			if (user) {
				const result = await UserRepository.getUserByObjectId(user._id);
				res.locals.user = result;
				req.session.user = result;
				if (user.userRole === 'partner') {
					const agency = await AgencyRepository.getAgencyByUserId(user._id);
					if (agency !== null) {
						res.locals.agency = agency;
						req.session.agency = agency;
					}
				}
			}
		}
		next();
	});

	// healthcheck route
	app.use('/website-api/healthcheck', (_req: express.Request, res: express.Response) => {
		res
			.status(200)
			.send(
				`${process.env.npm_package_name} (${
					process.env.npm_package_version
				}) up and running - ${Date.now()}`,
			);
	});

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

export { app };
