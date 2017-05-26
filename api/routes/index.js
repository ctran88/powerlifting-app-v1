'use strict';

var routes = require('express').Router();
var path = require('path');
var authentication = require('./authentication');
var user = require('./user');

// add subroute trees with root path as /api/*
routes.use('/api/authentication/', authentication);
routes.use('/api/user/', user);

// send landing page
routes.get('/', (req, res) => {

    var pagePath = path.resolve('../front-end/views/index.html');
    res.sendFile(pagePath);

});

module.exports = routes;
