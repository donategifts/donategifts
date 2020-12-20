/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */
import { config } from 'dotenv';
import * as cors from 'cors';
import * as path from 'path';

// EXPRESS SET UP
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as mongoSanitize from 'express-mongo-sanitize';
import * as connectMongo from 'connect-mongo';

// custom
import { connectSocket, logger } from '@donategifts/helper';
import { UserRepository } from '@donategifts/user';
import { AgencyRepository } from '@donategifts/agency';
import { ISessionUser } from '@donategifts/common';
import { MongooseConnection } from '@donategifts/db-connection';
import { RegisterRoutes } from './routes';

// load from config if not production, otherwise use from docker
if (process.env.NODE_ENV !== 'production') {
	let configPath = path.join(__dirname, '../../config/config.env');

	if (process.env.NODE_ENV === 'test') {
		configPath = path.join(__dirname, '../../config/test.config.env');
	}

	config({
		path: configPath,
	});
}

const app = express();

const bootServer = async () => {
	await MongooseConnection.connect();
	const MongoStore = connectMongo(session);

	const userRepository = UserRepository;
	const agencyRepository = AgencyRepository;

	app.use(cors);

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

	// MIDDLEWARE for extracting user and agency from a session
	app.use(async (req, res, next) => {
		if (req.session) {
			const { user } = req.session;
			if (user) {
				const result = await userRepository.getUserByObjectId(user._id);
				res.locals.user = result;
				req.session.user = result as ISessionUser;
				if (user.userRole === 'partner') {
					const agency = await agencyRepository.getAgencyByUserId(user._id);
					if (agency !== null) {
						res.locals.agency = agency;
						req.session.agency = agency;
					}
				}
			}
		}
		next();
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

	// error handler
	app.use((err, req, res, _next) => {
		res.locals.message = err.message;
		res.locals.error = req.app.get('env') === 'development' ? err : {};

		// TODO: send error messaging to slack/sentry?

		logger.error(err);

		res.status(500);
	});
};

bootServer().catch(err => {
	logger.error(err);
	process.exit(1);
});

export default app;
