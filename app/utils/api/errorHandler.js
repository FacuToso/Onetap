/* eslint-disable no-console */
import { UnauthorizedError } from 'express-jwt';
import {
  BadRequestError, ForbiddenError, MethodNotAllowedError, NotFoundError, InvalidOperationError,
} from './errors';

const errorHandler = (err, res) => {
  console.log('THERE WAS AN ERROR', err.message);

  // Default error is 500 - Internal Server Error
  let message = 'Internal Server Error';
  let statusCode = 500;

  // Checking Custom Errors
  if (err instanceof NotFoundError) {
    statusCode = 404;
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    message = err.message;
  } else if (err instanceof MethodNotAllowedError) {
    statusCode = 405;
    message = err.message;
  } else if (err instanceof BadRequestError) {
    statusCode = 400;
    message = err.message;
  } else if (err instanceof InvalidOperationError) {
    message = err.message;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    message = 'Not Authorized';
  }

  return res.status(statusCode).json({
    error: {
      message,
    },
  });
};

export default errorHandler;