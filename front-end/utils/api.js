'use strict';

import axios from 'axios';

axios.defaults.baseURL = 'https://192.168.54.54:3000/api';
axios.defaults.withCredentials = true;

export default {
    get(url, request) {
        return axios.get(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
    },
    post(url, request) {
        return axios.post(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
    },
    patch(url, request) {
        return axios.patch(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
    },
    delete(url, request) {
        return axios.delete(url, request)
            .then((response) => Promise.resolve(response))
            .catch((error) => Promise.reject(error));
    }
};
