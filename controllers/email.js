/*
 * Author: Stacy Sealky Lee
 * Class: CSC 337
 * Type: Final Project
 * FileName: controllers/email.js
 * FileDescription: 
 *      When user fills out the 'Contact' form in about.html, 
 *      it will use nodemailer and mailgun to send the user's message
 *      to the mailgun authorized email address
 *      all the req.body data from the 'Contact' form will be saved in our 'contacts' DB collection.
 *      Contact model lives in the models/Contact.js
 */

//NPM DEPENDENCIES
const nodemailer = require('nodemailer');
const mailGun = require('nodemailer-mailgun-transport');
const dotenv = require('dotenv');

//LOAD ENV VARS - we save all api keys in env for security
dotenv.config({ path: './config/config.env' });

//MAILGUN AUTHENTICATION
const auth = {
	auth: {
		api_key: process.env.MAILGUN_API_KEY,
		domain: process.env.MAILGUN_DOMAIN
	}
}

const transporter = nodemailer.createTransport(mailGun(auth));

//cb is callback, cb(err, null) means if err, get err, else null
//IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
const sendMail = (email, name, subject, message, cb) => {
    
	const mailOptions = {
		from: email,
		to: 'stacy.sealky.lee@gmail.com',
		subject: `${subject} | sent by: ${name}`,
		text: message
	};
	
	transporter.sendMail(mailOptions, (err, data) => {
		if (err) {
			cb(err, null);
			console.log(err);
		} else {
			cb(null, data);
			console.log("sendMail function successfully called");			
		}
	});
};

module.exports = sendMail;
