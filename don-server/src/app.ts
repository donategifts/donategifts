/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */

import * as dotenv from 'dotenv';
import * as cors from 'cors';

// EXPRESS SET UP
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as path from 'path';
import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';

import * as ejs from 'ejs';
import * as morgan from 'morgan';
import * as mongoSanitize from 'express-mongo-sanitize';

// custom
import { connectSocket, logger } from './helper/common';
import MongooseConnection from './db/connection';
import UserRepository from './db/repository/UserRepository';
import AgencyRepository from './db/repository/AgencyRepository';

// IMPORT ROUTE FILES
import { RegisterRoutes } from './routes';

import { ISessionUser } from './common';

// eslint-disable-next-line import/order
const MongoStore = require('connect-mongo')(session);

let configPath = '../../config/config.env';
if (process.env.NODE_ENV === 'test') {
  configPath = './config/test.config.env';
}
dotenv.config({
  path: configPath,
});

const app = express();

const userRepository = new UserRepository();
const agencyRepository = new AgencyRepository();

// MORGAN REQUEST LOGGER
if (process.env.NODE_ENV === 'development') {
  // colorful output for dev environment
  app.use(morgan('dev'));
}
app.use(cors());

// SET VIEW ENGINE AND RENDER HTML WITH EJS
app.set('views', path.join(__dirname, '../client/views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

// STATIC SET UP
app.use(express.static('./public'));
app.use('/wishcards/uploads', express.static('./uploads'));
app.use('/uploads', express.static('./uploads'));

MongooseConnection.connect();

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
// static files like css, js, images, fonts etc.
app.use(express.static('client'));

// MOUNT ROUTERS
RegisterRoutes(app);

app.get('/', (_req, res) => {
  res.render('home', {
    user: res.locals.user,
    wishcards: [],
  });
});

// ERROR PAGE
app.get('*', (req, res) => {
  logger.warn('404, Not sure where he wants to go:', { ...req.session, route: req.url });
  res.status(404).render('404');
});

// error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, req, res, _next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // TODO: send error message to slack/sentry?

  logger.error(err);

  // render the error page
  res.status(500);
  res.render('500');
});

// server start-up should happen after route registration and db connection
global.io = connectSocket(app);

export default app;
