
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const hostname = '127.0.0.1';
const port = 3000;
const mongoose = require('mongoose');
// const db  = mongoose.connection;
// const hostname = '157.245.243.18';
// const port = 80;
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
	extended: true,
	useUnifiedTopology: true
}));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('assets'));

var uri = 'mongodb+srv://stacysealky:pwd123@clusterstacy.fco5r.mongodb.net/ostaa?w=majority';
var db;
var options = {
	useNewUrlParser: true,
	useUnifiedTopology: true
};

mongoose.Promise = global.Promise;

mongoose.connect(uri, options, function (err, database) {
	if (err) {
		console.log('Unable to connect to the server. Error:', err);
	} else {
		console.log('Connected to server');
		db = database;
		app.listen(port, hostname, () => {
			console.log(`Server running at http://${hostname}:${port}/`);
		});
	}
});

// app.get('/', (res, req) => {
// })
