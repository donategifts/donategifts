/*
 * Author: Stacy Sealky Lee
 * FileName: app.js
 * FileDescription:
 * The set up codes are in an order,
 * so some functions won't work if you switch the order of what gets loaded in app.js first.
 *
 */

//EXPRESS SET UP
const express = require('express');
const app = express();

//NPM DEPENDENCIES
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const dotenv = require('dotenv');
const ejs = require('ejs');

//SET VIEW ENGINE AND RENDER HTML WITH EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', ejs.renderFile);

//STATIC SET UP
app.use(express.static('./public'));
app.use('/wishcards/uploads', express.static('./uploads'));
app.use('/uploads', express.static('./uploads'));

//DEV ENV
//const hostname = '127.0.0.1';
//const port = 8081;
// LIVE ENV
//const hostname = '64.227.8.216';
const hostname = '127.0.0.1';
const port = 8081;

//LOAD CONFIG.ENV VARS
dotenv.config({
  path: './config/config.env',
});

//DB SET UP & APP LISTEN (server starts after db connection)
var options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.Promise = global.Promise;
mongoose.set('useCreateIndex', true);
mongoose.connect(process.env.MONGO_URI, options, (err, database) => {
  if (err) {
    console.log('Unable to connect to DB. Error:', err);
  } else {
    console.log('Connected to Mongodb');
    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  }
});

//IMPORT MODELS
const User = require('./models/User');
const Agency = require('./models/Agency');
//SESSION SET UP
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
  })
);


// MIDDLEWARE for extracting userId from a session
app.use(async (req, res, next) => {
  const { user, agencyId } = req.session;
  if (user) {
    const result = await User.findById(user._id);
    res.locals.user = result;
  }
  if (agencyId) {
    const result = await Agency.findById(agencyId);
    res.locals.agency = result;
  }
  next();
});

//PARSERS SET UP
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
    useUnifiedTopology: true,
  })
);
app.use(cookieParser());

//IMPORT ROUTE FILES
const usersRoute = require('./routes/users');
const wishCardsRoute = require('./routes/wishCards');
const aboutRoute = require('./routes/about');

//MOUNT ROUTERS
app.use('/users', usersRoute);
app.use('/wishcards', wishCardsRoute);
app.use('/about', aboutRoute);

app.get('/', (req, res) => {
  res.render('home', {
    user: res.locals.user,
    wishcards: [],
  });
});

module.exports = app;