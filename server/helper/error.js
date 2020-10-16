const { log } = require('./logger');

// TODO: ADD MORE ERROR HANDLING HERE

class ErrorHandler extends Error {
  constructor(statusCode, message, name) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.name = name;
  }
}

const handleError = (res, code, error, status = 'error', success = false) => {
  let statusCode;
  let message;
  let name;

  if (typeof error === 'object') {
    name = error.name;
    statusCode = error.statusCode;
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  }

  statusCode = code || statusCode;

  // CONSOLE LOG FOR DEV ENV
  log(res, error);

  // MONGOOSE BAD OBJECT ID
  if (name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // MONGOOSE VALIDATION ERROR
  if (name === 'ValidationError') {
    message = Object.values(error.errors).map((val) => val.message);
    statusCode = 400;
  }

  res.status(statusCode).send({
    status,
    success,
    statusCode,
    message,
    error,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
