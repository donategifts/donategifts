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

const handleError = (res, code, err, status = 'error', success = false) => {
  let statusCode;
  let message;
  let name;

  if (typeof err === 'object') {
    name = err.name;
    statusCode = err.statusCode;
    message = err.message;
  } else if (typeof err === 'string') {
    message = err;
  }

  statusCode = code || statusCode;

  // CONSOLE LOG FOR DEV ENV
  log(res, err);

  // MONGOOSE BAD OBJECT ID
  if (name === 'CastError') {
    message = 'Resource not found';
    statusCode = 404;
  }

  // MONGOOSE VALIDATION ERROR
  if (name === 'ValidationError') {
    message = Object.values(err.errors).map((val) => val.message);
    statusCode = 400;
  }

  res.status(statusCode).send({
    status,
    success,
    statusCode,
    message,
    err,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
