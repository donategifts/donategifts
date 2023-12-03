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

		this.bindMethods();
	}

	private bindMethods() {
		const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		methods.forEach((method) => {
			const property = this[method as keyof this];
			if (typeof property === 'function' && method.startsWith('handle')) {
				this[method as keyof this] = property.bind(this);
			}
		});
	}

	sendResponse(res: Response, data: any, status = 200) {
		return res.status(status).send({
			data,
		});
	}

	handleError(res: Response, error: any, code = 400) {
		let statusCode: number;

		if (typeof error === 'object' && error.statusCode) {
			statusCode = error.statusCode;
		} else {
			statusCode = code;
		}

		this.log.error(error);
		return res.status(statusCode).send({
			error,
		});
	}
}
