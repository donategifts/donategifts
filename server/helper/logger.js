const { pino } = require('pino');

const pinoLogger = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
	hooks: {
		logMethod(inputArgs, method) {
			if (inputArgs.length === 2 && inputArgs[0].msg) {
				// eslint-disable-next-line no-param-reassign
				inputArgs[0].originalMsg = inputArgs[0].msg;
			}
			return method.apply(this, inputArgs);
		},
	},
});

pinoLogger.level = process.env.LOG_LEVEL || 'info';

const logger = {
	info: (...args) => {
		pinoLogger.info(...args.reverse());
	},
	warn: (...args) => {
		pinoLogger.warn(...args.reverse());
	},
	error: (...args) => {
		pinoLogger.error(...args.reverse());
	},
	critical: (...args) => {
		pinoLogger.fatal(...args.reverse());
	},
	debug: (...args) => {
		pinoLogger.debug(...args.reverse());
	},
};

module.exports = logger;
