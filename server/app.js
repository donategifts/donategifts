/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */

const dotenv = require('dotenv');
const cors = require('cors');

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
const responseTime = require('response-time');
const requestIp = require('request-ip');

const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const ejs = require('ejs');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const bcrypt = require('bcrypt');
const { connectSocket } = require('./helper/socket');

// STRIPE TEST API KEY
// const stripe = require('stripe')(process.env.STRIPE_TEST_KEY);

// custom db connection
const MongooseConnection = require('./db/connection');
const UserRepository = require('./db/repository/UserRepository');
const AgencyRepository = require('./db/repository/AgencyRepository');

const Agency = require('./db/models/Agency');
const Contact = require('./db/models/Contact');
const Donation = require('./db/models/Donation');
const Message = require('./db/models/Message');
const User = require('./db/models/User');
const WishCard = require('./db/models/WishCard');

const log = require('./helper/logger');

const app = express();

// MORGAN REQUEST LOGGER
if (process.env.NODE_ENV === 'development') {
  // colorful output for dev environment
  app.use(morgan('dev'));
}

app.use(
  responseTime((req, res, time) => {

    if (process.env.NODE_ENV !== 'test') {

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
// mongo connection needs to be established before admin-bro setup
MongooseConnection.connect();

AdminBro.registerAdapter(AdminBroMongoose);

const adminBro = new AdminBro({
  resources: [User, Agency, Contact, Donation, Message, WishCard],
  rootPath: '/admin',
});

const adminRouter = AdminBroExpress.buildAuthenticatedRouter(adminBro, {
  authenticate: async (email, password) => {
    const user = await UserRepository.getUserByEmail(email);
    const matched = await bcrypt.compare(password, user.password);
    if (user && user.userRole === 'admin' && matched) {
      return user;
    }
    return false;
  },
  cookiePassword: process.env.SESS_SECRET,
});

app.use(adminBro.options.rootPath, adminRouter);

// middleware need to be setup after admin-bro setup
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
app.use(bodyParser.json({
  verify (req, res, buf) {
    const url = req.originalUrl;
    if (url.startsWith('/stripe')) {
      req.rawBody = buf.toString();
    }
  }
}));
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
io = connectSocket(app);

// IMPORT ROUTE FILES
const usersRoute = require('./routes/users');
const wishCardsRoute = require('./routes/wishCards');
const missionRoute = require('./routes/mission');
const howtoRoute = require('./routes/howTo');
const faqRoute = require('./routes/faq');
const contactRoute = require('./routes/contact');
const stripeRoute = require('./routes/stripe');

// MOUNT ROUTERS
app.use('/users', usersRoute);
app.use('/wishcards', wishCardsRoute);
app.use('/mission', missionRoute);
app.use('/howto', howtoRoute);
app.use('/contact', contactRoute);
app.use('/faq', faqRoute);
app.use('/stripe', stripeRoute);

app.get('/', (_req, res) => {
  res.render('home', {
    user: res.locals.user,
    wishcards: [],
  });
});

// ERROR PAGE
app.get('*', (req, res) => {
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

module.exports = app;
