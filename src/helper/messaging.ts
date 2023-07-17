import fs from 'fs';
import path from 'path';

import axios from 'axios';
import { Colors } from 'discord.js';
import moment from 'moment';
import nodemailer from 'nodemailer';

import config from './config';
import log from './logger';

export default class Messaging {
	static get templates() {
		return {
			emailTemplate: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/emailTemplate.html'),
				{
					encoding: 'utf-8',
				},
			),

			donorDonationReceipt: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/donorDonationReceipt.html'),
				{
					encoding: 'utf-8',
				},
			),

			agencyDonationAlert: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/agencyDonationAlert.html'),
				{
					encoding: 'utf-8',
				},
			),

			partnerDonationAlert: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/partnerDonationAlert.html'),
				{
					encoding: 'utf-8',
				},
			),

			agencyVerified: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/agencyVerified.html'),
				{
					encoding: 'utf-8',
				},
			),
			verifyEmail: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/verifyEmail.html'),
				{
					encoding: 'utf-8',
				},
			),
		};
	}

	static get attachments() {
		return {
			donationTemplateAttachments: [
				{
					filename: 'new-donate-gifts-logo-2.png',
					path: path.resolve(
						__dirname,
						'../../resources/email/new-donate-gifts-logo-2.png',
					),
					cid: 'new-donate-gifts-logo-2.png',
				},
				{
					filename: 'email-gifts-illustration-removebg-preview.png',
					path: path.resolve(
						__dirname,
						'../../resources/email/email-gifts-illustration-removebg-preview.png',
					),
					cid: 'email-gifts-illustration-removebg-preview.png',
				},
				{
					filename: 'instagram2x.png',
					path: path.resolve(__dirname, '../../resources/email/instagram2x.png'),
					cid: 'instagram2x.png',
				},
				{
					filename: 'telegram2x.png',
					path: path.resolve(__dirname, '../../resources/email/telegram2x.png'),
					cid: 'telegram2x.png',
				},
				{
					filename: 'mail2x.png',
					path: path.resolve(__dirname, '../../resources/email/mail2x.png'),
					cid: 'mail2x.png',
				},
				{
					filename: 'website2x.png',
					path: path.resolve(__dirname, '../../resources/email/website2x.png'),
					cid: 'website2x.png',
				},
			],

			templateAttachments: [
				{
					filename: 'instagram2x.png',
					path: path.resolve(__dirname, '../../resources/email/instagram2x.png'),
					cid: 'instagram2x.png', // same cid value as in the html img src
				},
				{
					filename: 'telegram2x.png',
					path: path.resolve(__dirname, '../../resources/email/telegram2x.png'),
					cid: 'telegram2x.png',
				},
				{
					filename: 'website2x.png',
					path: path.resolve(__dirname, '../../resources/email/website2x.png'),
					cid: 'website2x.png', // same cid value as in the html img src
				},
				{
					filename: 'mail2x.png',
					path: path.resolve(__dirname, '../../resources/email/mail2x.png'),
					cid: 'mail2x.png', // same cid value as in the html img src
				},
				{
					filename: 'new-donate-gifts-logo-2.png',
					path: path.resolve(
						__dirname,
						'../../resources/email/new-donate-gifts-logo-2.png',
					),
					cid: 'new-donate-gifts-logo-2.png', // same cid value as in the html img src
				},
				{
					filename: 'Img1_2x.jpg',
					path: path.resolve(__dirname, '../../resources/email/Img1_2x.jpg'),
					cid: 'Img1_2x.jpg', // same cid value as in the html img src
				},
			],
		};
	}

	static async getTransport() {
		if (config.NODE_ENV === 'development' || config.NODE_ENV === 'test') {
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
					user: config.EMAIL.ADDRESS,
					pass: config.EMAIL.PASSWORD,
				},
			});
		}
	}

	// cb is callback, cb(err, null) means if err, get err, else null
	// IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
	static async sendMail(from, to, subject, message, attachments?) {
		try {
			const transporter = await this.getTransport();

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

				if (config.NODE_ENV === 'development') {
					return { success: true, data: nodemailer.getTestMessageUrl(data) };
				}

				return { success: true, data: '' };
			}
			return { success: false };
		} catch (e) {
			log.error(e);
			return { success: false };
		}
	}

	static sendDonationConfirmationMail({
		email,
		firstName,
		lastName,
		childName,
		item,
		price,
		agency,
	}) {
		const body = this.templates.donorDonationReceipt
			.replace('%firstName%', firstName)
			.replace(/%childName%/g, childName)
			.replace('%fullName%', `${firstName} ${lastName}`)
			.replace('%item%', item)
			.replace('%price%', price)
			.replace('%agency%', agency)
			// Jan 1st, 2020 <- date formatting
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString().toString())
			.replace('%date%', moment(new Date()).format('MMM Do, YYYY'));

		return this.sendMail(
			config.EMAIL.ADDRESS,
			email,
			'Donate-gifts.com Donation Receipt',
			body,
			this.attachments.donationTemplateAttachments,
		);
	}

	static sendDonationOrderedEmail({
		agencyEmail,
		agencyName,
		childName,
		itemName,
		itemPrice,
		donationDate,
		address,
	}) {
		const body = this.templates.partnerDonationAlert
			.replace('%agencyName%', agencyName)
			.replace(/%childName%/g, childName)
			.replace('%itemName%', itemName)
			.replace('%itemPrice%', itemPrice)
			.replace('%donationDate%', donationDate)
			.replace('%address%', address)
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString());

		return this.sendMail(
			config.EMAIL.ADDRESS,
			agencyEmail,
			'Donate-gifts.com Donation Item Ordered',
			body,
			this.attachments.donationTemplateAttachments,
		);
	}

	static sendVerificationEmail(to, hash) {
		const body = this.templates.verifyEmail
			.replace('%linkplaceholder%', `${config.BASE_URL}/profile/verify/${hash}`)
			.replace('%headerPlaceHolder%', 'Verify Your Email Account')
			.replace('%titlePlaceHolder%', 'Thank you for creating an account!')
			.replace(
				'%bodyPlaceHolder%',
				'Please confirm your email address to continue using our services.',
			)
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString())
			.replace('%buttonText%', 'Confirm Your Email');

		return this.sendMail(
			config.EMAIL.ADDRESS,
			to,
			'Donate-gifts.com Email verification',
			body,
			this.attachments.templateAttachments,
		);
	}

	static sendPasswordResetMail(to, hash) {
		const body = this.templates.emailTemplate
			.replace('%linkplaceholder%', `${config.BASE_URL}/profile/password/reset/${hash}`)
			.replace('%titlePlaceHolder%', 'Your password reset request')
			.replace('%headerPlaceHolder%', '')
			.replace('%bodyPlaceHolder%', 'Please click the button below to reset your password')
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString())
			.replace('%buttonText%', 'Reset Password');

		return this.sendMail(
			config.EMAIL.ADDRESS,
			to,
			'Donate-gifts.com Password Reset',
			body,
			this.attachments.templateAttachments,
		);
	}

	static async sendAgencyVerifiedMail(to) {
		this.sendMail(
			config.EMAIL.ADDRESS,
			to,
			'Donate-gifts.com Agency Account Verified',
			this.templates.agencyVerified,
			this.attachments.templateAttachments,
		);
	}

	static async sendAgencyVerificationNotification({ id, name, website, bio }) {
		if (!config.DISCORD.STATUS_WEBHOOK_URL) {
			return;
		}

		try {
			let content = config.NODE_ENV !== 'production' ? '[TEST] ' : '';
			content += 'A new agency has registered! <@766721399497687042>';

			await axios({
				method: 'POST',
				url: config.DISCORD.STATUS_WEBHOOK_URL,
			});

			await axios({
				method: 'POST',
				url: config.DISCORD.STATUS_WEBHOOK_URL,
				headers: {
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

	static sendAgencyDonationAlert({ email, firstName, lastName, childName, item, price, agency }) {
		const body = this.templates.agencyDonationAlert
			.replace(/%childName%/g, childName)
			.replace('%fullName%', `${firstName} ${lastName}`)
			.replace('%item%', item)
			.replace('%price%', price)
			.replace('%agency%', agency)
			// Jan 1st, 2020 <- date formatting
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString())
			.replace('%date%', moment(new Date()).format('MMM Do, YYYY'));

		return this.sendMail(
			config.EMAIL.ADDRESS,
			email,
			'Donate-gifts.com Donation Receipt',
			body,
			this.attachments.donationTemplateAttachments,
		);
	}

	static async sendFeedbackMessage({ name, email, subject, message }) {
		if (!config.DISCORD.STATUS_WEBHOOK_URL) {
			return;
		}

		try {
			let content = config.NODE_ENV !== 'production' ? '[TEST] ' : '';
			content += 'A new message from our contact form! <@766721399497687042>';

			return await axios({
				method: 'POST',
				url: config.DISCORD.STATUS_WEBHOOK_URL,
				headers: {
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

	static async sendDiscordDonationNotification({
		user,
		service,
		wishCard: { item, url, child },
		donation: { amount, userDonation },
	}) {
		if (!config.DISCORD.STATUS_WEBHOOK_URL) {
			return;
		}

		try {
			let content = config.NODE_ENV !== 'production' ? '[TEST] ' : '';
			content += 'One of our wish cards received a donation! <@766721399497687042>';

			return await axios({
				method: 'POST',
				url: config.DISCORD.STATUS_WEBHOOK_URL,
				headers: {
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
}
