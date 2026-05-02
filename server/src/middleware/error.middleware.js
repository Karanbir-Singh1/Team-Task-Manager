export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const isDatabaseConnectionError =
    err.message?.includes('Could not connect to any servers in your MongoDB Atlas cluster') ||
    err.message?.includes('SSL routines') ||
    err.name === 'MongooseServerSelectionError';

  const statusCode = isDatabaseConnectionError ? 503 : err.statusCode || 500;
  const details = err.details?.map((detail) => detail.message);

  res.status(statusCode).json({
    message: isDatabaseConnectionError
      ? 'Database connection failed. Check your MongoDB Atlas Network Access IP allowlist and connection string.'
      : err.message || 'Server error',
    details,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};
