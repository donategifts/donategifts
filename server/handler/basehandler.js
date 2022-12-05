const log = require('../helper/logger');

module.exports = class BaseHandler {
	constructor() {
		this.log = log;
	}

	handleError(res, code, errorMsg) {
		let statusCode = 400;
		let name = 'Error handler';
		let error;

		if (typeof errorMsg === 'object') {
			if (errorMsg.name) {
				name = errorMsg.name;
			}

			statusCode = errorMsg.statusCode;
			error = errorMsg;
		} else if (typeof errorMsg === 'string') {
			error = { msg: errorMsg };
		}

		statusCode = code || statusCode;

		this.log.error(`${name}:`, {
			statusCode,
			error,
		});

		res.status(statusCode).send({
			statusCode,
			error,
		});
	}
};
