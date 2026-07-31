const errorHandler = (err, req, res, next) => {
  console.error('❌ Error caught by global error handler:', err);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  const message = err.message || 'An unexpected internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: message
    }
  });
};

module.exports = errorHandler;
