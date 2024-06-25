/* eslint-disable no-console */
import axios from 'axios';

const methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

const baseURL = process.env.TMDB_API_BASE_URL;

const API = axios.create({
  baseURL,
});

const sendRequest = async (url, method, payload, options = { useApiKeyAuthentication: false }) => {
  const formattedPayload = {};

  if (payload) {
    if (method === methods.GET) {
      formattedPayload.params = payload;
    } else {
      formattedPayload.data = payload;
    }
  }

  let token = null;
  if (options.useApiKeyAuthentication) {
    formattedPayload.params = {
      ...formattedPayload.params,
      api_key: process.env.TMDB_API_KEY,
    }
  } else {
    token = process.env.TMDB_BEARER_TOKEN;
  }

  return API({
    url,
    method,
    ...(token && {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
    ...formattedPayload,
  })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

const get = (url, payload, options) => {
  return sendRequest(url, methods.GET, payload, options);
};

const post = (url, body, options) => {
  return sendRequest(url, methods.POST, body, options);
};

const put = (url, body, options) => {
  return sendRequest(url, methods.PUT, body, options);
};

const del = (url, body, options) => {
  return sendRequest(url, methods.DELETE, body, options);
};

export {
  get,
  post,
  put,
  del,
};