require('dotenv').config({
	path: './config/config.env',
});

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const requestIp = require('request-ip');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoSanitize = require('express-mongo-sanitize');

const { MongooseConnection } = require('./db/connection');
const log = require('./helper/logger');
const DGBot = require('./discord/bot');

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
		setTimeout(() => {
			liveReloadServer.refresh('/');
		}, 100);
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
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(
	session({
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
			autoRemove: 'interval',
			// interval is now in minutes
			autoRemoveInterval: 60,
		}),
		name: process.env.SESS_NAME,
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESS_SECRET,
		cookie: {
			maxAge: Number(process.env.SESS_LIFE),
			sameSite: true,
			secure: false,
		},
	}),
);

app.use((req, res, next) => {
	if (req.session?.user) {
		// assign user to locals if there's one present in the session
		res.locals.user = req.session.user;
	}

	// apply some of our environment variables to the locals so that they can be used in the templates
	res.locals.env = {
		stripe: process.env.STRIPE_API,
		paypal: process.env.PAYPAL_CLIENT,
		facebook: process.env.FB_APP_ID,
		google: process.env.G_CLIENT_ID,
	};

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

app.use('/robots.txt', (_req, res, _next) => {
	res.type('text/plain');
	res.sendFile(path.join(__dirname, '../public/robots.txt'));
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

app.listen(process.env.PORT, () => {
	log.info(`App listening on port ${process.env.PORT}`);
});

process.on('uncaughtException', (err) => {
	log.error(err);
});

module.exports = app;
