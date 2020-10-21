const { createLogger, format, transports } = require('winston');

const logger = createLogger({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf((debug) => {
      const { timestamp, level, message, ...args } = debug;

      const ts = timestamp.slice(0, 19).replace('T', ' ');
      return `${ts} [${level}]: ${message} ${
        Object.keys(args).length ? JSON.stringify(args, null, 2) : ''
      }`;
    }),
  ),
  transports: [new transports.Console()],
});

const log = logger.info;
const logWarn = logger.warn;
const logError = logger.error;

module.exports = {
  log,
  logWarn,
  logError,
};
