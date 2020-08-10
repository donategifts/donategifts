/*
 * Author: Stacy Sealky Lee, Jordan Huang
 * Class: CSC 337
 * Type: Final Project
 * FileName: app.js
 * FileDescription: 
 * this file is the server. It's setting up express, etc. 
 * Make sure to npm install for all dependencies before usage!!
 * (add more comments later)
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
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const xss = require('xss');
const dotenv = require('dotenv');
const webToken = require('jsonwebtoken');
const ejs = require('ejs');

//SET VIEW ENGINE AND RENDER HTML WITH EJS
app.set("view engine", "ejs");
app.engine('html', ejs.renderFile);

//DEV ENV
const hostname = '127.0.0.1';
const port = 8081;
// LIVE ENV
// const hostname = '157.245.243.18';
// const port = 80;

//LOAD CONFIG.ENV VARS
dotenv.config({
	path: './config/config.env'
});

//PARSERS SET UP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
	useUnifiedTopology: true
}));
app.use(cookieParser());

//SESSION SET UP
app.use(session({
	store: new MongoStore({
		url: process.env.MONGO_URI,
		clear_interval: 3600000
	}),
	name: process.env.SESS_NAME,
	resave: false,
	saveUninitialized: false,
	secret: process.env.SESS_SECRET,
	cookie: {
		maxAge: Number(process.env.SESS_LIFE), // cookie set to expire in 1 hour 
		sameSite: true,
		secure: process.env.NODE_ENV === 'production'
	}
}));

//DB SET UP & APP LISTEN (server starts after db connection)
var options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};
mongoose.Promise = global.Promise;
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

//STATIC SET UP
app.use(express.static('public'));
app.use(express.static('assets'));
app.use(express.static(__dirname));


// middleware for extracting userId from a session
app.use('/users', async (req, res, next) => {
	const { userId } = req.session;
	if (userId) {
		const result = await User.findById(userId);
		res.locals.user = result;
	}
	next();
});

//IMPORT ROUTE FILES
const usersRoute = require('./routes/users');
const wishCardsRoute = require('./routes/wishCards');

//MOUNT ROUTERS
app.use('/users', usersRoute);
app.use('/wishcards', wishCardsRoute);


//IMPORT MODELS
const User = require('./models/User');
const Contact = require('./models/Contact');


app.get('/about', (req, res) => {
    try {
        res.status(200).sendFile( path.join( __dirname, '/public', 'about.html' )); 
    } catch (error) {
        console.log(error);
    }
});


//EMAIL SENDING FUNCTION LIVES IN THE BELOW CONTROLLER
//EMAIL SENDING IS FROM THE CONTACT FORM IN ABOUT.HTML
//*** not sure where to place this yet, but please move this to an appropriate file later
const sendMail = require('./controllers/email');

// *** not sure where to place this yet, but please move this to an appropriate file later
// ROUTE FOR POST - DATA PULLED FROM CONTACT FORM TO SEND EMAIL
app.post('/about/email', async (req, res, next) => {
	try {
		var c = new Contact();
		c.name = req.body.name;
		c.email = req.body.email;
		c.subject = req.body.subject;
		c.message = req.body.message;
		sendMail(c.email, c.name, c.subject, c.message, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				console.log("email successfully sent");
			}
		});
		c.save((err) => {
			if (err) {
				console.log(err);
			} else {
				console.log("contact successfully saved to DB");
				return res.status(201).redirect('/');
			}
		});
	} catch (error) {
		res.status(400).send(JSON.stringify({
			success: false,
			message: "ERROR!"
		}));
	}
});