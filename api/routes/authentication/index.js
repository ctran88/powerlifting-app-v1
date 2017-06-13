'use strict';

var routes = require('express').Router();
var sessions = require('./sessions');

// Endpoints for /api/authentication/*
routes.get('/sessions', sessions.get);
routes.post('/sessions', sessions.post);
routes.delete('/sessions', sessions.delete);

module.exports = routes;
