import { Response } from 'express';
import logger from '../logger';

interface ICustomError extends Partial<Error> {
	statusCode?: number;
	msg: string;
}

class ErrorHandler extends Error {
	statusCode: number;

	constructor(statusCode: number, message: string, name: string) {
		super(message);
		this.statusCode = statusCode;
		this.name = name;
	}
}

const handleError = (res: Response, code: number, errorMsg: string | ICustomError): void => {
	let statusCode = 400;
	let name = 'Error handler';
	let error = {} as ICustomError;

	if (typeof errorMsg === 'object') {
		if (errorMsg.name) {
			name = errorMsg.name;
		}

		statusCode = Number(errorMsg.statusCode);
		error = errorMsg;
	} else if (typeof errorMsg === 'string') {
		error = { msg: errorMsg };
	}

	statusCode = code || statusCode;

	logger.error(`${name}:`, {
		statusCode,
		error,
	});

	res.status(statusCode).send({
		statusCode,
		error,
	});
};

export { ErrorHandler, handleError };
