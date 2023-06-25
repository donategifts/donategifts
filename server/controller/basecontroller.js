const { rateLimit } = require('express-rate-limit');
const log = require('../helper/logger');

module.exports = class BaseController {
	constructor(limitTime = 15) {
		this.log = log;

		this.limiter = rateLimit({
			windowMs: limitTime * 60 * 1000,
			max: 100,
		});
	}

	renderView(res, template, templateVars = {}, status = 200) {
		const parts = template.split('/');
		let templateString = template;
		if (parts[0] !== 'pages') {
			// eslint-disable-next-line no-param-reassign
			templateString = `pages/${template}`;
		}

		return res.status(status).render(templateString, templateVars);
	}

	handleError({ res, code, error, renderErrorPage = false }) {
		let statusCode = 400;

		if (typeof error === 'object') {
			statusCode = error.statusCode;
		} else if (typeof error === 'string') {
			// eslint-disable-next-line no-param-reassign
			error = { msg: error };
		}

		statusCode = code || statusCode;

		this.log.error(error);

		if (renderErrorPage) {
			res.status(statusCode).render(code === 400 ? '404' : code.toString(), {
				statusCode,
				error,
			});
		} else {
			res.status(statusCode).send({
				statusCode,
				error,
			});
		}
	}
};
