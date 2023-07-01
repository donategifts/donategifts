import { pino } from 'pino';

const pinoLogger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	// hooks: {
	// 	logMethod(inputArgs, method) {
	// 		if (inputArgs.length === 2 && inputArgs[0].msg) {
	// 			// eslint-disable-next-line no-param-reassign
	// 			inputArgs[0].originalMsg = inputArgs[0].msg;
	// 		}
	// 		return method.apply(this, inputArgs);
	// 	},
	// },
});

pinoLogger.level = process.env.LOG_LEVEL || 'info';

const logger = {
	info: <T>(...args: T[]) => {
		// @ts-ignore
		pinoLogger.info(...args.reverse());
	},
	warn: <T>(...args: T[]) => {
		// @ts-ignore
		pinoLogger.warn(...args.reverse());
	},
	error: <T>(...args: T[]) => {
		// @ts-ignore
		pinoLogger.error(...args.reverse());
	},
	critical: <T>(...args: T[]) => {
		// @ts-ignore
		pinoLogger.fatal(...args.reverse());
	},
	debug: <T>(...args: T[]) => {
		// @ts-ignore
		pinoLogger.debug(...args.reverse());
	},
};

export default logger;
