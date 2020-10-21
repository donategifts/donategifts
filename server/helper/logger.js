const { writeFileSync, existsSync, mkdirSync } = require('fs');
const path = require('path');
const Util = require('util');
const moment = require('moment');

function ensureDirectoryExistence(options) {
  const { filePath, dirPath } = options;
  const proposedPath = filePath ? path.dirname(filePath) : dirPath;

  if (!proposedPath) return false;

  if (existsSync(proposedPath)) {
    return true;
  }
  ensureDirectoryExistence({ filePath: proposedPath });
  mkdirSync(proposedPath);
  return true;
}

ensureDirectoryExistence({ dirPath: path.join(__dirname, '../logs') });

/**
 * Logs to the console and writes logs into a log file
 * @param {*} req
 * @param {*} options
 * @param {*} any
 * @param {*} error
 * @param {*} additional
 */
const log = function doLog(req, error = '', additional = '') {
  const logFct = console.log;

  let prefix;
  if (typeof req === 'object' && req.method && req.protocol && req.get('host') && req.originalUrl) {
    prefix = `[${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}]`;
  } else {
    prefix = '[INFO]';
  }

  let text = req;
  if (typeof error === 'object') {
    text = Util.inspect(error, false, 5).replace(/\n/g, '');
  }

  logFct(new Date().toISOString(), prefix, text, error, additional);
  let e = '';
  if (typeof error === 'object') {
    e = `${error.toString()} ${error.stack || ''}`;
  }

  // only write into log directory if we aren't on production
  if (process.env.NODE_ENV !== 'production') {
    writeFileSync(
      `${path.join(__dirname, `../logs/${moment(new Date()).format('DD-MM-YYYY')}.log`)}`,
      `${new Date().toISOString()} INFO: ${text} ${e}\n`,
      { flag: 'a+' },
    );
  }
};

module.exports = { log };
