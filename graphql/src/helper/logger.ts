import { configure, getLogger, levels } from 'log4js';

configure({
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: levels.ALL.levelStr },
  },
});

export const logger = getLogger();
