import fs from 'fs';
import path from 'path';

import axios from 'axios';
import moment from 'moment';
import nodemailer from 'nodemailer';

import config from './config';
import log from './logger';

export default class Messaging {
	static get templates() {
		return {
			//general
			emailTemplate: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/emailTemplate.html'),
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
			//agency-only
			agencyWishPublished: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/agencyWishPublished.html'),
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
			agencyVerified: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/agencyVerified.html'),
				{
					encoding: 'utf-8',
				},
			),
			agencyMessageAlert: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/agencyMessageAlert.html'),
				{
					encoding: 'utf-8',
				},
			),
			agencyShippingAlert: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/agencyShippingAlert.html'),
				{
					encoding: 'utf-8',
				},
			),
			//donor-only
			donorDonationAlert: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/donorDonationAlert.html'),
				{
					encoding: 'utf-8',
				},
			),
			donorShippingAlert: fs.readFileSync(
				path.resolve(__dirname, '../../resources/email/donorShippingAlert.html'),
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
					cid: 'instagram2x.png',
				},
				{
					filename: 'telegram2x.png',
					path: path.resolve(__dirname, '../../resources/email/telegram2x.png'),
					cid: 'telegram2x.png',
				},
				{
					filename: 'website2x.png',
					path: path.resolve(__dirname, '../../resources/email/website2x.png'),
					cid: 'website2x.png',
				},
				{
					filename: 'mail2x.png',
					path: path.resolve(__dirname, '../../resources/email/mail2x.png'),
					cid: 'mail2x.png',
				},
				{
					filename: 'new-donate-gifts-logo-2.png',
					path: path.resolve(
						__dirname,
						'../../resources/email/new-donate-gifts-logo-2.png',
					),
					cid: 'new-donate-gifts-logo-2.png',
				},
				{
					filename: 'Img1_2x.jpg',
					path: path.resolve(__dirname, '../../resources/email/Img1_2x.jpg'),
					cid: 'Img1_2x.jpg',
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

	// IF WE WANT TO CHANGE THE RECIPIENT ADDRESS LATER, MUST AUTHORIZE IN MAILGUN SYSTEM FIRST
	static async sendMail(
		from: string | null,
		to: string,
		subject: string,
		message: string,
		attachments?: { filename: string; path: string; cid: string }[],
	) {
		try {
			if (!from) {
				throw new Error('No default email set in .env!!!');
			}

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
					log.info(nodemailer.getTestMessageUrl(data));
				}

				return { success: true, data: '' };
			}
			return { success: false };
		} catch (e) {
			log.error(e);
			return { success: false };
		}
	}

	static sendDonationConfirmationEmail({
		email,
		firstName,
		lastName,
		childName,
		item,
		price,
		agency,
	}) {
		const body = this.templates.donorDonationAlert
			.replace('%firstName%', firstName)
			.replace(/%childName%/g, childName)
			.replace('%fullName%', `${firstName} ${lastName}`)
			.replace('%item%', item)
			.replace('%price%', price)
			.replace('%agency%', agency)
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString().toString())
			.replace('%date%', moment(new Date()).format('MMM Do, YYYY'));

		return this.sendMail(
			config.EMAIL.ADDRESS,
			email,
			`Your donation receipt for ${childName}'s wish`,
			body,
			this.attachments.donationTemplateAttachments,
		);
	}

	static sendWishPublishedEmail({ agencyEmail, childName, wishCardId }) {
		const body = this.templates.agencyWishPublished
			.replace(/%childName%/g, childName)
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString())
			.replace('%wishCardId%', wishCardId);

		return this.sendMail(
			config.EMAIL.ADDRESS,
			agencyEmail,
			`Wish card is published for ${childName}`,
			body,
			this.attachments.templateAttachments,
		);
	}

	static sendAgencyMessageAlert({ agencyEmail, childName, message, donorFirstName }) {
		const body = this.templates.agencyMessageAlert
			.replace(/%childName%/g, childName)
			.replace('%message%', message)
			.replace('%donorFirstName%', donorFirstName);
		return this.sendMail(
			config.EMAIL.ADDRESS,
			agencyEmail,
			`${childName} received a new message!`,
			body,
		);
	}

	static sendAgencyDonationEmail({
		agencyEmail,
		agencyName,
		childName,
		item,
		price,
		donationDate,
		address,
	}) {
		const body = this.templates.agencyDonationAlert
			.replace('%agencyName%', agencyName)
			.replace(/%childName%/g, childName)
			.replace('%item%', item)
			.replace('%price%', price)
			.replace('%date%', donationDate)
			.replace('%address%', address)
			.replace('%currentYearPlaceholder%', new Date().getUTCFullYear().toString());

		return this.sendMail(
			config.EMAIL.ADDRESS,
			agencyEmail,
			`New donation alert for ${childName}'s wish`,
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
			.replace('%buttonText%', 'Confirm Email');

		return this.sendMail(
			config.EMAIL.ADDRESS,
			to,
			'Verify your email for DonateGifts',
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
			'Reset password for DonateGifts',
			body,
			this.attachments.templateAttachments,
		);
	}

	static async sendAgencyVerifiedMail(to: string) {
		await this.sendMail(
			config.EMAIL.ADDRESS,
			to,
			'Your agency account is verified!',
			this.templates.agencyVerified,
		);
	}

	static sendAgencyShippingAlert({
		agencyEmail,
		childName,
		donorFirstName,
		itemName,
		donationOrderId,
		trackingInfo,
		agencyAddress,
	}) {
		const body = this.templates.agencyShippingAlert
			.replace(/%childName%/g, childName)
			.replace(/%donorFirstName%/g, donorFirstName)
			.replace('%itemName%', itemName)
			.replace('%orderId%', donationOrderId)
			.replace(/%trackingInfo%/g, trackingInfo)
			.replace('%agencyAddress%', agencyAddress);

		return this.sendMail(
			config.EMAIL.ADDRESS,
			agencyEmail,
			`Shipping confirmed for ${childName}`,
			body,
		);
	}

	static sendDonorShippingAlert({
		donorEmail,
		donorFirstName,
		childName,
		itemName,
		agencyName,
		donationOrderId,
		trackingInfo,
		wishCardId,
	}) {
		const body = this.templates.donorShippingAlert
			.replace('%donorFirstName%', donorFirstName)
			.replace(/%childName%/g, childName)
			.replace('%item%', itemName)
			.replace('%agency%', agencyName)
			.replace('%orderId%', donationOrderId)
			.replace(/%trackingInfo%/g, trackingInfo)
			.replace('%wishCardId%', wishCardId);

		return this.sendMail(
			config.EMAIL.ADDRESS,
			donorEmail,
			`Shipping confirmed for ${childName}`,
			body,
		);
	}

	//NOTE: Broken - only works sometimes
	static async sendAgencyVerificationNotification({ id, name, website, bio }) {
		if (!config.DISCORD.AGENCY_REGISTRATION_WEBHOOK_URL) {
			return;
		}

		try {
			let content = config.NODE_ENV !== 'production' ? '[TEST] ' : '';
			content += 'A new agency has registered! <@766721399497687042>';

			await axios({
				method: 'POST',
				url: config.DISCORD.AGENCY_REGISTRATION_WEBHOOK_URL,
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

								${website}
								
								Please check their website before verifying it!

								Agency Id: ${id}
                        	`,
							color: 16776960, // #FFFF00
						},
					],
				},
			});
		} catch (error) {
			log.error(error);
		}
	}

	static async sendFeedbackMessage({ name, email, subject, message }) {
		if (!config.DISCORD.CONTACT_WEBHOOK_URL) {
			return;
		}

		try {
			let content = config.NODE_ENV !== 'production' ? '[TEST] ' : '';
			content += 'A new message from our contact form! <@766721399497687042>';

			return await axios({
				method: 'POST',
				url: config.DISCORD.CONTACT_WEBHOOK_URL,
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
							color: 1752220, // #1ABC9C
						},
					],
				},
			});
		} catch (error) {
			log.error(error);
			return;
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
							color: 5793266, // #5865F2
						},
					],
				},
			});
		} catch (error) {
			log.error(error);
			return;
		}
	}
}
