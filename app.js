
/*
 * Author: Stacy Sealky Lee
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
const nodemailer = require('nodemailer');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const xss = require('xss');
const dotenv = require('dotenv');
const webToken = require('jsonwebtoken');
const ejs = require('ejs');
app.set('view engine', 'ejs');

//DEV ENV
const hostname = '127.0.0.1';
const port = 8081;

// LIVE PRODUCTION ENV
// const hostname = '157.245.243.18';
// const port = 80;

//LOAD ENV VARS
dotenv.config({ path: './config/config.env' });

//PARSERS SET UP
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true,
	useUnifiedTopology: true
}));
app.use(cookieParser());

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
		maxAge: Number(process.env.SESS_LIFE),	// cookie set to expire in 1 hour 
		sameSite: true,
		secure: process.env.NODE_ENV === 'production'
	}
}));


//DB SET UP & APP LISTEN (server starts after db connection)
//DB URI IN CONFIG.ENV - DO NOT PUSH CONFIG.ENV
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

//ROUTE FILES - **ADD MORE HERE
// app.use(express.static('public'));
// app.use(express.static('assets'));
const userRoute = require('./routes/users');

//IMPORT MODELS
const User = require('./models/User');

//TODO: MOUNT ROUTERS HERE
// app.use('/users', userRoute);

//UNHANDLED REJECTION - PROMISE
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`);
	app.close(() => process.exit(1));
})

// PREVENT XSS ATTACKS
// app.use(xss());

// SWICH /home to /profile

const redirectLogin = (req, res, next) => {
	if (!req.session.userId) {
		res.redirect('/login');
	} else {
		next();
	}
}

const redirectHome = (req, res, next) => {
	if (req.session.userId) {
		res.redirect('/home');
	} else {
		next();
	}
}

app.use(async (req, res, next) => {
	const { userId } = req.session;
	if (userId) {
		const result = await User.findById(userId);
		res.locals.user = result; 
	}
	next();
});

app.get('/', (req, res) => {
	const { userId } = req.session;

	res.send(`
		<h1>Welcome!</h1>
		${userId ? `
			<a href='/home'>Home</a>
			<form method='post' action='/logout'>
				<button>Logout</button>
			</form>
		` : `
			<a href='/login'>Login</a>
			<a href='/register'>Register</a>
		`} 
	`);
});

app.get('/home', redirectLogin, (req, res) => {
	const { user } = res.locals;
	res.send(`
		<h1>Home</h1>
		<a href='/'>Main</a>
		<ul>
			<li>Name: ${user.fName}</li>
			<li>Email: ${user.lName}</li>
		</ul>
	`);
});

app.get('/login', redirectHome, (req, res) => {
	res.send(`
		<h1>Login</h1>
		<form method='post' action='/login'>
			<input type='email' name='email' placeholder='Email' required />
			<input type='password' name='password' placeholder='Password' required />
			<input type='submit' />
		</form>
		<a href='/register'>Register</a>
	`);
});

app.get('/register', redirectHome, (req, res) => {
	res.send(`
		<h1>Register</h1>
		<form method='post' action='/register'>
			<input name='fName' placeholder='fName' required />
			<input name='lName' placeholder='lName' required />
			<input type='email' name='email' placeholder='Email' required />
			<input type='password' name='password' placeholder='Password' required />
			<input type='submit' />
		</form>
		<a href='/login'>Login</a>
	`);
});

app.post('/login', redirectHome, async (req, res) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email: email });
	if (user) {
		if (await bcrypt.compare(password, user.password)) {
			req.session.userId = user.id;
			return res.redirect('/home');
		}
	}
	res.redirect('/login');
});

// remove this route later
app.get('/clear', (req, res) => {
	User.find({}).remove().exec();
	res.redirect('/register');
})

app.post('/register', redirectHome, async (req, res) => {
	const { email } = req.body;
	const result = await User.findOne({ email: email });
	if (result) {
		return res.redirect('/register');
	}
	req.body.password = await bcrypt.hash(req.body.password, 10);
	const newUser = await User.create(req.body);
	req.session.userId = newUser._id;
	return res.redirect('/home');
});

app.post('/logout', redirectLogin, (req, res) => {
	req.session.destroy(err => {
		if (err) {
			return res.redirect('/home');
		}

		res.clearCookie(process.env.SESS_NAME);
		res.redirect('/login');
	});
});

// BASIC HOME ROUTING 
// (remove or edit this later after completing routes and controllers)
// app.get('/', (req,res) => {
// 	res.sendFile(path.join(__dirname,'public','index.html'));
// });