import getConfig from 'next/config';
import util from 'util';

const { expressjwt: jwt } = require('express-jwt');

const { serverRuntimeConfig } = getConfig();

const dontValidateJwt = (req, isPublicEndpoint) => {
  // We won't validate JWT if no token was specified and the endpoint is public.
  const token = req.headers.authorization;
  
  return !token && isPublicEndpoint;
};

const jwtMiddleware = (req, res, isPublicEndpoint) => {
  const middleware = jwt({ secret: serverRuntimeConfig.secret, algorithms: ['HS256'] }).unless((req) => dontValidateJwt(req, isPublicEndpoint));

  return util.promisify(middleware)(req, res);
};

export default jwtMiddleware;