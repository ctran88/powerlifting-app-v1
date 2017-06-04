'use strict';

var routes = require('express').Router();
var config = require('../../config/config').config;
var path = require('path');
var verification = require(path.join(__dirname, '/../../utils/authentication/', config.authentication, '/verification'));
var users = require('./users');

// Endpoints for /api/users/*
routes.get('/', verification.verifyCookie, users.getMany);
routes.get('/:email', verification.verifyCookie, users.getOne);
routes.post('/', verification.verifyCookie, users.post);
routes.patch('/:email', verification.verifyCookie, users.patch);
routes.delete('/:email', verification.verifyCookie, users.delete);

module.exports = routes;
