// TODO: ADD MORE ERROR HANDLING HERE
const log = require('./logger');

class ErrorHandler extends Error {
  constructor(statusCode, message, name) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.name = name;
  }
}

const handleError = (res, code, error) => {
  let statusCode = 400;
  let name = 'Error handler';

  if (typeof error === 'object') {
    if (error.name) {
      name = error.name;
    }

    statusCode = error.statusCode;
  }

  statusCode = code || statusCode;

  log.error(`${name}:`, {
    statusCode,
    error,
  });

  res.status(statusCode).send({
    statusCode,
    error,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
