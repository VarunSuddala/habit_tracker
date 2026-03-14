/**
 * Centralized error handler middleware.
 * Catches errors thrown in route handlers and returns a clean JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Error',
    message,
  });
};

module.exports = { errorHandler };
