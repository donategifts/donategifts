const { pino } = require('pino');

const logger = pino({
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

logger.level = process.env.LOG_LEVEL || 'info';

module.exports = logger;
