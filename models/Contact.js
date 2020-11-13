//This data model is for sending emails through nodemailer
//Everything the user enters in the contact form in about.html 
//will be saved in the 'contact' collections in our DB

const mongoose = require('mongoose');

//SCHEMA SETUP
var Schema = mongoose.Schema;
var ContactSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	subject: {
		type: String,
		required: true
    },
    message: {
		type: String,
		required: true
    },
	sentDate: {
		type: Date,
		default: Date.now
	},
}, {
	collection: 'contacts'
});

module.exports = mongoose.model('Contact', ContactSchema);