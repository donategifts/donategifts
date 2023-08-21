import { Response } from 'express';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';

import logger from '../helper/logger';

export default class BaseController {
	public log: typeof logger;

	public limiter: RateLimitRequestHandler;

	constructor(limitTime = 15) {
		this.log = logger;

		this.limiter = rateLimit({
			windowMs: limitTime * 60 * 1000,
			max: 100,
		});
	}

	renderView(res: Response, template: string, templateVars = {}, status = 200) {
		const parts = template.split('/');
		let templateString = template;
		if (parts[0] !== 'pages') {
			templateString = `pages/${template}`;
		}

		return res.status(status).render(templateString, templateVars);
	}

	sendResponse(res: Response, data: any, status = 200) {
		return res.status(status).send({
			data,
		});
	}

	handleError(res: Response, error: any, code = 400, renderErrorPage = false) {
		let statusCode: number;

		if (typeof error === 'object' && error.statusCode) {
			statusCode = error.statusCode;
		} else {
			statusCode = code;
		}

		this.log.error(error);

		if (renderErrorPage) {
			return res.status(statusCode).render(code === 400 ? '404' : code.toString(), {
				statusCode,
				error,
			});
		} else {
			return res.status(statusCode).send({
				error,
			});
		}
	}
}
