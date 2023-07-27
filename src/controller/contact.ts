import { NextFunction, Request, Response } from 'express';

import ContactRepository from '../db/repository/ContactRepository';
import Messaging from '../helper/messaging';

import BaseController from './basecontroller';

export default class ContactController extends BaseController {
	private contactRepository: ContactRepository;

	constructor() {
		super();
		this.contactRepository = new ContactRepository();

		this.handleGetIndex = this.handleGetIndex.bind(this);
		this.handlePostEmail = this.handlePostEmail.bind(this);
		this.handlePostCustomerService = this.handlePostCustomerService.bind(this);
	}

	handleGetIndex(_req: Request, res: Response, _next: NextFunction) {
		this.renderView(res, 'contact');
	}

	async handlePostEmail(req, res, _next) {
		try {
			const contact = await this.contactRepository.createNewContact({
				name: req.body.name,
				email: req.body.email,
				subject: `${req.body.subject} | send from ${req.body.name}`,
				message: req.body.message,
				sentDate: new Date(),
			});

			const mailResponse = await Messaging.sendMail(
				contact.email,
				'stacy.sealky.lee@gmail.com',
				contact.subject,
				contact.message,
			);

			if (!mailResponse?.success) {
				this.log.error('failed to send email');
			} else {
				this.log.info('email successfully sent', req);
			}

			return res.status(201).redirect('/');
		} catch (error) {
			this.handleError(res, 'Failed to send Email!');
		}
	}

	async handlePostCustomerService(req: Request, res: Response, _next: NextFunction) {
		const { name, email, subject, message } = req.body;
		const done = await Messaging.sendFeedbackMessage({ name, email, subject, message });

		if (done) {
			return res.status(200).send({
				success: true,
			});
		}

		return this.handleError(res, 'Failed to send feedback! Please try again in a few minutes!');
	}
}
