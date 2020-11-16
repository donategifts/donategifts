const { configure, getLogger, levels } = require('log4js');

configure({
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
    logstash: {
      type: '@log4js-node/logstashudp',
      host: 'localhost',
      port: 5000,
    },
  },
  categories: {
    default: { appenders: ['console'], level: levels.ALL },
    development: { appenders: ['console', 'logstash'], level: levels.ALL },
    production: { appenders: ['console', 'logstash'], level: levels.ALL },

  },

});

module.exports = getLogger(process.env.NODE_ENV);
