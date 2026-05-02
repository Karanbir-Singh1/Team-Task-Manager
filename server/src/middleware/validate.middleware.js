import { ApiError } from '../utils/apiError.js';

export const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(
    { body: req.body, query: req.query, params: req.params },
    { abortEarly: false, stripUnknown: true }
  );

  if (error) {
    const apiError = new ApiError(400, 'Validation failed');
    apiError.details = error.details;
    throw apiError;
  }

  req.body = value.body || req.body;
  req.query = value.query || req.query;
  req.params = value.params || req.params;
  next();
};
