const { configure, getLogger, levels } = require('log4js');

const appenderArray = ['console'];

const config = {
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: levels.ALL },
    development: { appenders: appenderArray, level: levels.ALL },
    production: { appenders: appenderArray, level: levels.ALL },
  },
};

configure(config);

module.exports = getLogger(process.env.NODE_ENV);
