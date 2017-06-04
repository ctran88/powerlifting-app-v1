'use strict';

var routes = require('express').Router();
var config = require('../../config/config').config;
var path = require('path');
var verification = require(path.join(__dirname, '/../../utils/authentication/', config.authentication, '/verification'));
var programs = require('./programs');
var logs = require('./logs');

// add subroute trees with root path as /api/training/*
routes.get('/api/training/programs', verification.verifyCookie, programs.get);
routes.post('/api/training/programs', verification.verifyCookie, programs.post);
routes.patch('/api/training/programs', verification.verifyCookie, programs.patch);
routes.delete('/api/training/programs', verification.verifyCookie, programs.delete);

routes.get('/api/training/logs', verification.verifyCookie, logs.get);
routes.post('/api/training/logs', verification.verifyCookie, logs.post);
routes.patch('/api/training/logs', verification.verifyCookie, logs.patch);
routes.delete('/api/training/logs', verification.verifyCookie, logs.delete);

module.exports = routes;
