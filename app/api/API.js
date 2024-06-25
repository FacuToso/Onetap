/* eslint-disable no-console */
import Router from 'next/router';
import axios from 'axios';
import { NotificationManager } from "react-notifications";

const methods = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
};

const baseURL = '/api';

const API = axios.create({
  baseURL,
});

const sendRequest = async (url, method, payload) => {
  const formattedPayload = {};

  if (payload) {
    if (method === methods.GET) {
      formattedPayload.params = payload;
    } else {
      formattedPayload.data = payload;
    }
  }

  const token = localStorage.getItem('token');

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
      const { response } = error;
      NotificationManager.error(response.data?.error.message);

      if (error.response.status === 401) {
        // Token is invalid. Logging out
        localStorage.clear();
        window.location.href = '/';
      }
      throw error;
    });
};

const get = (url, payload) => {
  return sendRequest(url, methods.GET, payload);
};

const post = (url, body) => {
  return sendRequest(url, methods.POST, body);
};

const put = (url, body) => {
  return sendRequest(url, methods.PUT, body);
};

const del = (url) => {
  return sendRequest(url, methods.DELETE);
};

export {
  get,
  post,
  put,
  del,
};