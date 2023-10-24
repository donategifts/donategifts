import { Response } from 'express';
import { RateLimitRequestHandler, rateLimit } from 'express-rate-limit';

import logger from '../../helper/logger';

export default class BaseController {
	protected log: typeof logger;

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
			const property = this[method];

			if (
				typeof property === 'function' &&
				method !== 'constructor' &&
				method.startsWith('handle')
			) {
				this[method] = property.bind(this);
			}
		});
	}

	protected sendResponse<T>(response: Response, data: T, status = 200) {
		return response.status(status).send(data);
	}

	protected handleError(response: Response, error: any, code = 400) {
		let statusCode: number;

		if (typeof error === 'object' && error.statusCode) {
			statusCode = error.statusCode;
		} else {
			statusCode = code;
		}

		return response.status(statusCode).send(error);
	}
}
