'use strict';

var routes = require('express').Router();
var session = require('./session');

// Endpoints for /authentication/*
routes.post('/session', session.post);
routes.delete('/session', session.delete);

module.exports = routes;
