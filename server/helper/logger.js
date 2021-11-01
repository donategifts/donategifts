const { configure, getLogger, levels } = require('log4js');

const appenderArray = ['console'];
if (process.env.NODE_ENV !== 'development') {
  appenderArray.push('logstash');
}

const config = {
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
    logstash: {
      type: 'log4js-logstash-tcp',
      host: 'localhost',
      port: 5044,
    }
  },
  categories: {
    default: { appenders: ['console'], level: levels.ALL },
    development: { appenders: appenderArray, level: levels.ALL },
    production: { appenders: appenderArray, level: levels.ALL },
  },
}

configure(config);

module.exports = getLogger(process.env.NODE_ENV);
