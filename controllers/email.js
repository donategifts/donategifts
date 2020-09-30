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
const bcrypt = require('bcrypt');

//cb is callback, cb(err, null) means if err, get err, else null
//IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
const sendMail = async (from, to, subject,  message) => {

	getTransport()
	.then(transporter => {
		const mailOptions = {
			from: from,
			to: to,
			subject: subject,
			text: message
		};

		transporter.sendMail(mailOptions, (error, data) => {
			if (error) {
				return {error}
			} else {
				console.log("sendMail function successfully called");
				if (process.env.NODE_ENV === 'development') {
					console.log('Preview URL: %s', nodemailer.getTestMessageUrl(data));
				}
				return {data}
			}
		});
	})
};

const getTransport = () => {

	return new Promise((resolve, reject)=> {

		if (process.env.NODE_ENV === 'development') {

			nodemailer.createTestAccount((err, account) => {
				if (err) {
					reject('Failed to create a testing account. ' + err.message)
					console.error('Failed to create a testing account. ' + err.message);
				}

				// Create a SMTP transporter object
				transporter = nodemailer.createTransport({
					host: account.smtp.host,
					port: account.smtp.port,
					secure: account.smtp.secure,
					auth: {
						user: account.user,
						pass: account.pass
					}
				});
				resolve(transporter);

			});

			//LIVE data
		} else {
			const auth = {
				auth: {
					api_key: process.env.MAILGUN_API_KEY,
					domain: process.env.MAILGUN_DOMAIN
				}
			}

			const transporter = nodemailer.createTransport(mailGun(auth));
			resolve(transporter);

		}
	})

}

const createEmailVerificationHash = () => {

	let result           = '';
	const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for ( let i = 0; i < 18; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result
}


module.exports = {sendMail, createEmailVerificationHash};
