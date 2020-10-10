//TODO: ADD MORE ERROR HANDLING HERE

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // CONSOLE LOG FOR DEV ENV
  console.log(err);

  // MONGOOSE BAD OBJECT ID
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }

  // MONGOOSE VALIDATION ERROR
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = errorHandler;
