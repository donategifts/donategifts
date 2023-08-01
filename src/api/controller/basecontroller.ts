import { Response } from 'express';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';

import logger from '../../helper/logger';

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
			res.status(statusCode).render(code === 400 ? '404' : code.toString(), {
				statusCode,
				error,
			});
		} else {
			res.status(statusCode).send({
				error,
			});
		}
	}
}
