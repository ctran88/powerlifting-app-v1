'use strict';

var routes = require('express').Router();
var config = require('../../config/config').config;
var path = require('path');
var verification = require(path.join(__dirname, '/../../utils/authentication/', config.authentication, '/verification'));
var programs = require('./programs');
var library = require('./library');

/* 
 * add subroute trees with root path as /api/training/*
 */

// /api/training/programs/*
routes.get('/programs', verification.verifyCookie, programs.get);
routes.post('/programs', verification.verifyCookie, programs.post);
routes.patch('/programs/:id', verification.verifyCookie, programs.patch);
routes.delete('/programs/:id', verification.verifyCookie, programs.delete);

// /api/training/library/*/*
routes.get('/library/:type', verification.verifyCookie, library.get);
routes.post('/library/:type/:id', verification.verifyCookie, library.post);
routes.patch('/library/:type/:id', verification.verifyCookie, library.patch);
routes.delete('/library/:type/:id', verification.verifyCookie, library.delete);

module.exports = routes;
