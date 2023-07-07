const path = require('path');
const fs = require('fs');

const dotenv = require('dotenv');

dotenv.config({
	path: path.join(__dirname, '../config/config.env'),
});

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const requestIp = require('request-ip');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');
const config = require('../config');

const MongooseConnection = require('./db/connection');
const log = require('./helper/logger');
const DGBot = require('./discord/bot');

const app = express();

const mongooseConnection = new MongooseConnection();

// hot reloading in dev environment
if (config.NODE_ENV === 'development') {
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

if (config.DISCORD.CLIENT_ID) {
	const bot = new DGBot();

	bot.refreshCommands();
	bot.initClient();
}

app.use(cors());

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

app.use(express.static('public'));

if (config.NODE_ENV === 'development') {
	app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
}

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: config.MONGO_URI,
			autoRemove: 'interval',
			// interval is now in minutes
			autoRemoveInterval: 60,
		}),
		name: config.SESSION.NAME,
		resave: false,
		saveUninitialized: false,
		secret: config.SESSION.SECRET,
		cookie: {
			maxAge: Number(config.SESSION.LIFE),
			sameSite: true,
			secure: false,
		},
	}),
);

// apply some of our environment variables to the app locals so that they can be used in the templates
app.locals.env = {
	stripe: config.STRIPE.KEY,
	paypal: config.PAYPAL.CLIENT_ID,
	facebook: config.FB_APP_ID,
	google: config.G_CLIENT_ID,
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
		verify(req, _res, buf) {
			const url = req.originalUrl;
			if (url.startsWith('/payment')) {
				req.rawBody = buf.toString();
			}
		},
	}),
);

app.use(
	bodyParser.urlencoded({
		extended: true,
		useUnifiedTopology: true,
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

const routes = fs.readdirSync(path.join(__dirname, './routes'));

// dynamically mount all routes present in /routes folder
for (const route of routes) {
	if (fs.lstatSync(path.join(__dirname, `./routes/${route}`)).isFile()) {
		const file = route.split('.')[0];
		if (file === 'home') {
			app.use('/', require(`./routes/${file}`));
		} else {
			app.use(`/${file}`, require(`./routes/${file}`));
		}
	}
}

const apis = fs.readdirSync(path.join(__dirname, './api'));

// dynamically mount all api routes present in /api folder
for (const api of apis) {
	if (fs.lstatSync(path.join(__dirname, `./api/${api}`)).isFile()) {
		const file = api.split('.')[0];
		app.use(`/api/${file}`, require(`./api/${file}`));
	}
}

app.use('/robots.txt', (_req, res, _next) => {
	res.type('text/plain');
	res.sendFile(path.join(__dirname, '../public/robots.txt'));
});

app.use('/health', (_req, res, _next) => {
	res.status(200).json({ status: 'ok' });
});

if (config.MAINTENANCE_ENABLED === 'true') {
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

app.listen(config.PORT, () => {
	log.info(`App listening on port ${config.PORT}`);
});

process.on('uncaughtException', (err) => {
	log.error(err);
});

module.exports = app;
