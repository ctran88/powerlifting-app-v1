'use strict';

var routes = require('express').Router();
var user = require('./user');

// Endpoints for /user/*
routes.post('/', user);

module.exports = routes;
