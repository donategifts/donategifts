import { Request, Response, NextFunction } from 'express';

import Messaging from '../../helper/messaging';

import BaseController from './basecontroller';

export default class ContactController extends BaseController {
	async handlePostContactForm(req: Request, res: Response, _next: NextFunction) {
		const { name, email, subject, message } = req.body;
		const done = await Messaging.sendFeedbackMessage({ name, email, subject, message });

		if (done) {
			return this.sendResponse(res, {});
		}

		return this.handleError(res, 'Failed to send feedback! Please try again in a few minutes!');
	}
}
