/*
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 */

require('dotenv').config({
  path: process.env.NODE_ENV === 'test' ? './config/test.config.env' : './config/config.env',
});

const cors = require('cors');

// EXPRESS SET UP
const express = require('express');
const bodyParser = require('body-parser');
const responseTime = require('response-time');
const requestIp = require('request-ip');

const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const ejs = require('ejs');
const mongoSanitize = require('express-mongo-sanitize');

// custom db connection
const MongooseConnection = require('./db/connection');
const UserRepository = require('./db/repository/UserRepository');
const AgencyRepository = require('./db/repository/AgencyRepository');

const log = require('./helper/logger');

const DGBot = require('./discord/bot');

const app = express();

app.use(
  responseTime((req, res, time) => {
    if (process.env.NODE_ENV !== 'test' && req.originalUrl !== '/health') {
      if (
        (!req.originalUrl.includes('.png') &&
          !req.originalUrl.includes('.jpg') &&
          !req.originalUrl.includes('.js') &&
          !req.originalUrl.includes('.svg') &&
          !req.originalUrl.includes('.jpeg') &&
          !req.originalUrl.includes('.woff') &&
          !req.originalUrl.includes('.css') &&
          !req.originalUrl.includes('.ico')) ||
        res.statusCode > 304
      ) {
        const clientIp = requestIp.getClientIp(req);

        log.info('New request', {
          type: 'request',
          user: res.locals.user ? String(res.locals.user._id).substring(0, 10) : 'guest',
          method: req.method,
          statusCode: res.statusCode,
          route: req.originalUrl,
          responseTime: Math.ceil(time),
          ip: clientIp,
        });
      }
    }
  }),
);

MongooseConnection.connect();

const bot = new DGBot();

bot.refreshCommands();
bot.initClient();

app.use(cors());

// SET VIEW ENGINE AND RENDER HTML WITH EJS
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

// STATIC SET UP
app.use(express.static('./public'));
app.use('/wishcards/uploads', express.static('./uploads'));
app.use('./uploads', express.static('./uploads'));
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// SESSION SET UP
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
      maxAge: Number(process.env.SESS_LIFE), // cookie set to expire in 1 hour
      sameSite: true,
      secure: false,
    },
  }),
);

// MIDDLEWARE for extracting user and agency from a session
app.use(async (req, res, next) => {
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
  next();
});

// PARSERS SET UP
app.use(
  express.json({
    verify(req, res, buf) {
      const url = req.originalUrl;
      if (url.startsWith('/stripe')) {
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
// static files like css, js, images, fonts etc.
app.use(express.static('client'));

// needs to be declared before routes otherwise sockets wont be available in routes
// IMPORT ROUTE FILES
const usersRoute = require('./routes/users');
const wishCardsRoute = require('./routes/wishCards');
const missionRoute = require('./routes/mission');
const howtoRoute = require('./routes/howTo');
const faqRoute = require('./routes/faq');
const contactRoute = require('./routes/contact');
const teamRoute = require('./routes/team');
const stripeRoute = require('./routes/stripe');
const communityRoute = require('./routes/community');
const indexRoute = require('./routes/index');

// MOUNT ROUTERS
app.use('/users', usersRoute);
app.use('/wishcards', wishCardsRoute);
app.use('/mission', missionRoute);
app.use('/howto', howtoRoute);
app.use('/contact', contactRoute);
app.use('/faq', faqRoute);
app.use('/stripe', stripeRoute);
app.use('/community', communityRoute);
app.use('/team', teamRoute);
app.use('/', indexRoute);

app.use('/robots.txt', (req, res, _next) => {
  res.type('text/plain');
  res.sendFile(path.join(__dirname, '../client/public/robots.txt'));
});

// static maintenance page
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, '../client/views/maintenance.html'));
// });

// ERROR PAGE
app.get('*', (req, res) => {
  res.status(404).render('404');
});

// error handler
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // TODO: send error message to slack/sentry?
  log.error(err);

  // render the error page
  res.status(500);
  res.render('500');
});

app.listen(process.env.PORT, () => {
  log.info(`App listening on port ${process.env.PORT}`);
});

process.on('uncaughtException', (err) => {
  log.error(err);
});

module.exports = app;
