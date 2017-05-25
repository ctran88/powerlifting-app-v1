'use strict';

var routes = require('express').Router();
var session = require('./session');

// Endpoints for /authentication/*
routes.post('/session', session);
routes.delete('/session', session);

module.exports = routes;
