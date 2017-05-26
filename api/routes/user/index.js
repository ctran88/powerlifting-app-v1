'use strict';

var routes = require('express').Router();
var user = require('./user');

// Endpoints for /user/*
routes.get('/', user.getMany);
routes.get('/:email', user.getOne);
routes.post('/', user.post);
routes.patch('/:email', user.patch);
routes.delete('/:email', user.delete);

module.exports = routes;
