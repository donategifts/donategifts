const pino = require('pino');

const log = pino({
	transport: {
		target: 'pino-pretty',
		options: {
			colorize: true,
		},
	},
});

log.level = process.env.LOG_LEVEL || 'info';

module.exports = log;
