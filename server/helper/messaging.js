const moment = require('moment');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { Colors } = require('discord.js');
const log = require('./logger');

const template = fs.readFileSync(path.resolve(__dirname, '../resources/email/emailTemplate.html'), {
	encoding: 'utf-8',
});

const donationTemplate = fs.readFileSync(
	path.resolve(__dirname, '../resources/email/donorDonationReceipt.html'),
	{
		encoding: 'utf-8',
	},
);

const agencyDonationAlert = fs.readFileSync(
	path.resolve(__dirname, '../resources/email/agencyDonationAlert.html'),
	{
		encoding: 'utf-8',
	},
);

const donationOrderedTemplate = fs.readFileSync(
	path.resolve(__dirname, '../resources/email/partnerDonationAlert.html'),
	{
		encoding: 'utf-8',
	},
);
const agencyVerfiedTemplate = fs.readFileSync(
	path.resolve(__dirname, '../resources/email/agencyVerified.html'),
	{
		encoding: 'utf-8',
	},
);

const donationTemplateAttachments = [
	{
		filename: 'new-donate-gifts-logo-2.png',
		path: path.resolve(__dirname, '../resources/email/new-donate-gifts-logo-2.png'),
		cid: 'new-donate-gifts-logo-2.png',
	},
	{
		filename: 'email-gifts-illustration-removebg-preview.png',
		path: path.resolve(
			__dirname,
			'../resources/email/email-gifts-illustration-removebg-preview.png',
		),
		cid: 'email-gifts-illustration-removebg-preview.png',
	},
	{
		filename: 'instagram2x.png',
		path: path.resolve(__dirname, '../resources/email/instagram2x.png'),
		cid: 'instagram2x.png',
	},
	{
		filename: 'telegram2x.png',
		path: path.resolve(__dirname, '../resources/email/telegram2x.png'),
		cid: 'telegram2x.png',
	},
	{
		filename: 'mail2x.png',
		path: path.resolve(__dirname, '../resources/email/mail2x.png'),
		cid: 'mail2x.png',
	},
	{
		filename: 'website2x.png',
		path: path.resolve(__dirname, '../resources/email/website2x.png'),
		cid: 'website2x.png',
	},
];
const templateAttachments = [
	{
		filename: 'instagram2x.png',
		path: path.resolve(__dirname, '../resources/email/instagram2x.png'),
		cid: 'instagram2x.png', // same cid value as in the html img src
	},
	{
		filename: 'telegram2x.png',
		path: path.resolve(__dirname, '../resources/email/telegram2x.png'),
		cid: 'telegram2x.png',
	},
	{
		filename: 'website2x.png',
		path: path.resolve(__dirname, '../resources/email/website2x.png'),
		cid: 'website2x.png', // same cid value as in the html img src
	},
	{
		filename: 'mail2x.png',
		path: path.resolve(__dirname, '../resources/email/mail2x.png'),
		cid: 'mail2x.png', // same cid value as in the html img src
	},
	{
		filename: 'new-donate-gifts-logo-2.png',
		path: path.resolve(__dirname, '../resources/email/new-donate-gifts-logo-2.png'),
		cid: 'new-donate-gifts-logo-2.png', // same cid value as in the html img src
	},
	{
		filename: 'Img1_2x.jpg',
		path: path.resolve(__dirname, '../resources/email/Img1_2x.jpg'),
		cid: 'Img1_2x.jpg', // same cid value as in the html img src
	},
];

const getTransport = async () => {
	if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
		const account = await nodemailer.createTestAccount();

		if (account) {
			return nodemailer.createTransport({
				host: account.smtp.host,
				port: account.smtp.port,
				auth: {
					user: account.user,
					pass: account.pass,
				},
			});
		}

		// LIVE data
	} else {
		return nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			auth: {
				user: process.env.DEFAULT_EMAIL,
				pass: process.env.DEFAULT_EMAIL_PASSWORD,
			},
		});
	}
};
// cb is callback, cb(err, null) means if err, get err, else null
// IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
const sendMail = async (from, to, subject, message, attachments = undefined) => {
	try {
		const transporter = await getTransport();

		if (transporter) {
			const mailOptions = {
				from,
				to,
				subject,
				html: message,
				attachments,
			};

			const data = await transporter.sendMail(mailOptions);

			if (!data) {
				return { success: false };
			}

			if (process.env.NODE_ENV === 'development') {
				return { success: true, data: nodemailer.getTestMessageUrl(data) };
			}

			return { success: true, data: '' };
		}
		return { success: false };
	} catch (e) {
		log.error(e);
	}
};

const sendDonationConfirmationMail = async ({
	email,
	firstName,
	lastName,
	childName,
	item,
	price,
	agency,
}) => {
	const body = donationTemplate
		.replace('%firstName%', firstName)
		.replace(/%childName%/g, childName)
		.replace('%fullName%', `${firstName} ${lastName}`)
		.replace('%item%', item)
		.replace('%price%', price)
		.replace('%agency%', agency)
		// Jan 1st, 2020 <- date formatting
		.replace('%currentYearPlaceholder%', new Date().getUTCFullYear())
		.replace('%date%', moment(new Date()).format('MMM Do, YYYY'));

	return sendMail(
		process.env.DEFAULT_EMAIL,
		email,
		'Donate-gifts.com Donation Receipt',
		body,
		donationTemplateAttachments,
	);
};

const sendDonationOrderedEmail = async ({
	agencyEmail,
	agencyName,
	childName,
	itemName,
	itemPrice,
	donationDate,
	address,
}) => {
	const body = donationOrderedTemplate
		.replace('%agencyName%', agencyName)
		.replace(/%childName%/g, childName)
		.replace('%itemName%', itemName)
		.replace('%itemPrice%', itemPrice)
		.replace('%donationDate%', donationDate)
		.replace('%address%', address)
		.replace('%currentYearPlaceholder%', new Date().getUTCFullYear());

	return sendMail(
		process.env.DEFAULT_EMAIL,
		agencyEmail,
		'Donate-gifts.com Donation Item Ordered',
		body,
		donationTemplateAttachments,
	);
};

const sendVerificationEmail = async (to, hash) => {
	const body = template
		.replace('%linkplaceholder%', `${process.env.BASE_URL}/profile/verify/${hash}`)
		.replace('%headerPlaceHolder%', 'Verify Your Email Account')
		.replace('%titlePlaceHolder%', 'Thank you for creating an account!')
		.replace(
			'%bodyPlaceHolder%',
			'Please confirm your email address to continue using our services.',
		)
		.replace('%currentYearPlaceholder%', new Date().getUTCFullYear())
		.replace('%buttonText%', 'Confirm Your Email');

	return sendMail(
		process.env.DEFAULT_EMAIL,
		to,
		'Donate-gifts.com Email verification',
		body,
		templateAttachments,
	);
};

const sendPasswordResetMail = async (to, hash) => {
	const body = template
		.replace('%linkplaceholder%', `${process.env.BASE_URL}/profile/password/reset/${hash}`)
		.replace('%titlePlaceHolder%', 'Your password reset request')
		.replace('%headerPlaceHolder%', '')
		.replace('%bodyPlaceHolder%', 'Please click the button below to reset your password')
		.replace('%currentYearPlaceholder%', new Date().getUTCFullYear())
		.replace('%buttonText%', 'Reset Password');

	return sendMail(
		process.env.DEFAULT_EMAIL,
		to,
		'Donate-gifts.com Password Reset',
		body,
		templateAttachments,
	);
};

const createEmailVerificationHash = () => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < 18; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;
};

const sendAgencyVerifiedMail = async (to) =>
	sendMail(
		process.env.DEFAULT_EMAIL,
		to,
		'Donate-gifts.com Agency Account Verified',
		agencyVerfiedTemplate,
		templateAttachments,
	);

async function sendAgencyVerificationNotification({ id, name, website, bio }) {
	try {
		let content = process.env.NODE_ENV !== 'production' ? '[TEST] ' : '';
		content += 'A new agency has registered! <@766721399497687042>';

		await axios({
			method: 'POST',
			url: `${process.env.DISCORD_STATUS_WEBHOOK_URL}`,
			header: {
				'Content-Type': 'application/json',
			},
			data: {
				content,
				embeds: [
					{
						author: {
							name,
							url: website,
						},
						description: `
                            ${bio}

                            [${website}](${website})
                            
                            Please check their website before verifying it!
                        `,
						color: Colors.Yellow,
						footer: {
							text: `Want to verify it? /verifyagency ${id}`,
						},
					},
				],
			},
		});
	} catch (error) {
		log.error(error);
	}
}

const sendAgencyDonationAlert = async ({
	email,
	firstName,
	lastName,
	childName,
	item,
	price,
	agency,
}) => {
	const body = agencyDonationAlert
		.replace(/%childName%/g, childName)
		.replace('%fullName%', `${firstName} ${lastName}`)
		.replace('%item%', item)
		.replace('%price%', price)
		.replace('%agency%', agency)
		// Jan 1st, 2020 <- date formatting
		.replace('%currentYearPlaceholder%', new Date().getUTCFullYear())
		.replace('%date%', moment(new Date()).format('MMM Do, YYYY'));

	return sendMail(
		process.env.DEFAULT_EMAIL,
		email,
		'Donate-gifts.com Donation Receipt',
		body,
		donationTemplateAttachments,
	);
};

async function sendFeedbackMessage({ name, email, subject, message }) {
	try {
		let content = process.env.NODE_ENV !== 'production' ? '[TEST] ' : '';
		content += 'A new message from our contact form! <@766721399497687042>';

		return await axios({
			method: 'POST',
			url: `${process.env.DISCORD_CONTACT_WEBHOOK_URL}`,
			header: {
				'Content-Type': 'application/json',
			},
			data: {
				content,
				embeds: [
					{
						author: {
							name,
						},
						description: `
                            ${email}
                            ${subject}

                            ${message}
                        `,
						color: Colors.Aqua,
					},
				],
			},
		});
	} catch (error) {
		log.error(error);
	}
}

async function sendDiscordDonationNotification({
	user,
	service,
	wishCard: { item, url, child },
	donation: { amount, userDonation },
}) {
	try {
		let content = process.env.NODE_ENV !== 'production' ? '[TEST] ' : '';
		content += 'One of our wish cards received a donation! <@766721399497687042>';

		return await axios({
			method: 'POST',
			url: `${process.env.DISCORD_STATUS_WEBHOOK_URL}`,
			header: {
				'Content-Type': 'application/json',
			},
			data: {
				content,
				embeds: [
					{
						author: {
							user,
						},
						description: `
                            ${user} donated to ${child} via ${service}

                            ${item}
                            ${url}

                            $${amount} was covered.
                            ${userDonation > 0 ? `We received something too: $${userDonation}` : ''}
                        `,
						color: Colors.Blurple,
					},
				],
			},
		});
	} catch (error) {
		log.error(error);
	}
}

module.exports = {
	sendMail,
	sendAgencyVerifiedMail,
	sendDonationOrderedEmail,
	createEmailVerificationHash,
	sendVerificationEmail,
	sendPasswordResetMail,
	sendDonationConfirmationMail,
	sendAgencyVerificationNotification,
	sendFeedbackMessage,
	sendDiscordDonationNotification,
	sendAgencyDonationAlert,
};
