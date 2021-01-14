import { NextFunction, Request, Response } from 'express';
import { logger } from '@donategifts/helper';

const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
	logger.info({
		method: req.method,
		ip: req.ip,
		url: req.url,
		session: req.session?.user ? { user: req.session.user } : 'guest',
	});

	next();
};

export default requestLogger;
