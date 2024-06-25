import errorHandler from './errorHandler';
import MethodNotAllowedError from './errors/MethodNotAllowedError';
import jwtMiddleware from './middleware/jwtMiddleware';

const apiHandler = (handler, isPublicEndpoint = false) => {
  return async (req, res) => {
    const method = req.method.toLowerCase();

    try {
      // Check if HTTP Method is allowed
      if (!handler[method]) throw new MethodNotAllowedError(`Method ${req.method} Not Allowed`);

      // Middleware
      await jwtMiddleware(req, res, isPublicEndpoint);

      // Route handler
      await handler[method](req, res);
    } catch (err) {
      // Global error handler
      errorHandler(err, res, req.url);
    }
  };
};

export default apiHandler;