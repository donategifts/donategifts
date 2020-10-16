/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */

// EXPRESS SET UP
const express = require('express');

const app = express();

// NPM DEPENDENCIES
const bodyParser = require('body-parser');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');
const ejs = require('ejs');
// custom db connection
const Mongoose = require('./db/connection');
const UserRepository = require('./db/repository/UserRepository');
const AgencyRepository = require('./db/repository/AgencyRepository');

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

// LOAD CONFIG.ENV vars
let configPath = './config/config.env';
if (process.env.NODE_ENV === 'test') {
  configPath = './config/test.config.env';
}
dotenv.config({
  path: configPath,
});

// DB SET UP & APP LISTEN (server starts after db connection)
Mongoose.connect(app, port, hostname);

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

module.exports = app;
