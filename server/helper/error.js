// TODO: ADD MORE ERROR HANDLING HERE
const log = require('./logger');

class ErrorHandler extends Error {
	constructor(statusCode, message, name) {
		super();
		this.statusCode = statusCode;
		this.message = message;
		this.name = name;
	}
}

const handleError = (res, code, errorMsg) => {
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

	log.error(`${name}:`, {
		statusCode,
		error,
	});

	res.status(statusCode).send({
		statusCode,
		error,
	});
};

module.exports = {
	ErrorHandler,
	handleError,
};
