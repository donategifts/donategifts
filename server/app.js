/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */

const dotenv = require('dotenv');

let configPath = './config/config.env';
if (process.env.NODE_ENV === 'test') {
  configPath = './config/test.config.env';
}
dotenv.config({
  path: configPath,
});

// EXPRESS SET UP
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const ejs = require('ejs');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');

// custom db connection
const MongooseConnection = require('./db/connection');
const UserRepository = require('./db/repository/UserRepository');
const AgencyRepository = require('./db/repository/AgencyRepository');

const log = require('./helper/logger');

const app = express();

// MORGAN REQUEST LOGGER
if (process.env.NODE_ENV === 'development') {
  // colorful output for dev environment
  app.use(morgan('dev'));
}

// SET VIEW ENGINE AND RENDER HTML WITH EJS
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

// STATIC SET UP
app.use(express.static('./public'));
app.use('/wishcards/uploads', express.static('./uploads'));
app.use('/uploads', express.static('./uploads'));

// DEV ENV
// const hostname = '127.0.0.1';
// const port = 8081;
// LIVE ENV
// const hostname = '64.227.8.216';
const hostname = '127.0.0.1';
const port = 8081;

// SESSION SET UP
app.use(
  session({
    store: new MongoStore({
      url: process.env.MONGO_URI,
      clear_interval: 3600000,
    }),
    name: process.env.SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      maxAge: Number(process.env.SESS_LIFE), // cookie set to expire in 1 hour
      sameSite: true,
      secure: process.env.NODE_ENV === 'production',
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
app.use(bodyParser.json());
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

// IMPORT ROUTE FILES
const usersRoute = require('./routes/users');
const wishCardsRoute = require('./routes/wishCards');
const aboutRoute = require('./routes/about');

// MOUNT ROUTERS
app.use('/users', usersRoute);
app.use('/wishcards', wishCardsRoute);
app.use('/about', aboutRoute);

app.get('/', (_req, res) => {
  res.render('home', {
    user: res.locals.user,
    wishcards: [],
  });
});

// ERROR PAGE
app.get('*', (req, res) => {
  log.warn('404, Not sure where he wants to go:', { ...req.session, route: req.url });
  res.status(404).render('404');
});

// error handler
// eslint-disable-next-line no-unused-vars
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

// DB SET UP & APP LISTEN (server starts after db connection)
MongooseConnection.connect(app, port, hostname);

module.exports = app;
