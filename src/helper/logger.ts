import { pino } from 'pino';

import config from './config';

const pinoLogger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: config.NODE_ENV === 'development',
        },
    },
});

pinoLogger.level = config.LOG_LEVEL || 'info';

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
