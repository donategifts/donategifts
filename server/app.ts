import path from 'path';

import bodyParser from 'body-parser';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { config } from 'dotenv';
import express, { Request, Response } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import session from 'express-session';
import requestIp from 'request-ip';
import responseTime from 'response-time';

import { routes as apiRoutes } from './api/';
import MongooseConnection from './db/connection';
import DGBot from './discord/bot';
import log from './helper/logger';
import { routes } from './routes/';

config({
	path: './config/config.env',
});

const app = express();

const mongooseConnection = new MongooseConnection();

// hot reloading in dev environment
if (process.env.NODE_ENV === 'development') {
	// eslint-disable-next-line import/no-extraneous-dependencies
	const livereload = require('livereload');
	// eslint-disable-next-line import/no-extraneous-dependencies
	const connectLiveReload = require('connect-livereload');
	const liveReloadServer = livereload.createServer();

	liveReloadServer.server.once('connection', () => {
		setTimeout(
			() => {
				liveReloadServer.refresh('/');
			},
			// set timeout to 2 seconds so that react can finish compiling
			2000,
		);
	});

	app.use(connectLiveReload());
}

app.use(
	responseTime((req, res, _time) => {
		const ignoredRequests = [
			'png',
			'jpg',
			'js',
			'svg',
			'jpeg',
			'woff',
			'css',
			'ico',
			'map',
			'gif',
		];

		const parts = req.originalUrl.split('.');

		if (req.originalUrl !== '/health' && !ignoredRequests.includes(parts[parts.length - 1])) {
			const clientIp = requestIp.getClientIp(req);

			const logString = `[${res.statusCode}] ${req.method} ${clientIp} (${
				res.locals.user ? `USER ${String(res.locals.user._id)}` : 'GUEST'
			}) path: ${req.originalUrl}`;

			log.info(logString);
		}
	}),
);

mongooseConnection.connect();

if (process.env.DISCORD_CLIENT_ID) {
	const bot = new DGBot();

	bot.refreshCommands();
	bot.initClient();
}

app.use(cors());

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
	app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			autoRemove: 'interval',
			// interval is now in minutes
			autoRemoveInterval: 60,
		}),
		name: String(process.env.SESS_NAME),
		resave: false,
		saveUninitialized: false,
		secret: String(process.env.SESS_SECRET),
		cookie: {
			maxAge: Number(process.env.SESS_LIFE),
			sameSite: true,
			secure: false,
		},
	}),
);

// apply some of our environment variables to the app locals so that they can be used in the templates
app.locals.env = {
	stripe: String(process.env.STRIPE_KEY),
	paypal: String(process.env.PAYPAL_CLIENT_ID),
	facebook: String(process.env.FB_APP_ID),
	google: String(process.env.G_CLIENT_ID),
};

app.use((req, res, next) => {
	// TODO: assign agency to locals if there's one present in the request
	if (req.session?.user) {
		res.locals.user = req.session.user;
	}

	next();
});

app.use(
	express.json({
		verify(req: Request, _res: Response, buffer: Buffer) {
			const url = req.originalUrl;
			if (url.startsWith('/payment')) {
				req.rawBody = buffer.toString();
			}
		},
	}),
);

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

app.use('/', routes);
app.use('/api', apiRoutes);

app.use('/robots.txt', (_req, res, _next) => {
	res.type('text/plain');
	res.sendFile(path.join(__dirname, '../public/robots.txt'));
});

app.use('/health', (_req, res, _next) => {
	res.status(200).json({ status: 'ok' });
});

if (process.env.MAINTENANCE_ENABLED === 'true') {
	app.get('*', (_req, res) => {
		res.status(200).render('maintenance');
	});
}

// ERROR PAGE
app.get('*', (_req, res) => {
	res.status(404).render('error/404');
});

// error handler
app.use((err, req, res, _next) => {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	log.error(err);

	res.status(500).render('error/500');
});

export default app;
