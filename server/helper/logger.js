const { configure, getLogger, levels } = require('log4js');

configure({
  appenders: {
    console: { type: 'console', layout: { type: 'colored' } },
  },
  categories: {
    default: { appenders: ['console'], level: levels.ALL },
    development: { appenders: ['console'], level: levels.ALL },
    production: { appenders: ['console'], level: levels.ALL },

  },

});

module.exports = getLogger(process.env.NODE_ENV);
