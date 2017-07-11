'use strict';

import axios from 'axios';

axios.defaults.baseURL = 'https://192.168.54.54:3000/api';
axios.defaults.withCredentials = true;

export default {
    /**
     * GET api call
     *
     * @param      {string}  url      The url
     * @param      {Object}  request  The request
     * @return     {Promise}  Promise of api response
     */
  get(url, request) {
    return axios.get(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
  },

    /**
     * POST api call
     *
     * @param      {string}  url      The url
     * @param      {Object}  request  The request
     * @return     {Promise}  Promise of api response
     */
  post(url, request) {
    return axios.post(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
  },

    /**
     * PATCH api call
     *
     * @param      {string}  url      The url
     * @param      {Object}  request  The request
     * @return     {Promise}  Promise of api response
     */
  patch(url, request) {
    return axios.patch(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
  },

    /**
     * DELETE api call
     *
     * @param      {string}  url      The url
     * @param      {Object}  request  The request
     * @return     {Promise}  Promise of api response
     */
  delete(url, request) {
    return axios.delete(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
  }
};
