const log = require('../helper/logger');

module.exports = class BaseHandler {
	constructor() {
		this.log = log;
	}

	renderView(res, template, templateVars, status = 200) {
		const parts = template.split('/');
		let templateString = template;
		if (parts[0] !== 'pages') {
			// eslint-disable-next-line no-param-reassign
			templateString = `pages/${template}`;
		}

		const vars = {};

		if (res.locals.user) {
			vars.user = { ...res.locals.user };
		}

		return res.status(status).render(templateString, {
			...vars,
			...templateVars,
		});
	}

	handleError({ res, code, error, renderErrorPage = false }) {
		let statusCode = 400;
		let name = 'Error handler';

		if (typeof error === 'object') {
			if (error.name) {
				name = error.name;
			}

			statusCode = error.statusCode;
		} else if (typeof error === 'string') {
			// eslint-disable-next-line no-param-reassign
			error = { msg: error };
		}

		statusCode = code || statusCode;

		this.log.error({
			name,
			statusCode,
			...error,
		});

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
