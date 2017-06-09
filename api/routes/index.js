'use strict';

var routes = require('express').Router();
var path = require('path');
var authentication = require('./authentication');
var users = require('./users');
var training = require('./training');

// add subroute trees with root path as /api/*
routes.use('/api/authentication/', authentication);
routes.use('/api/users/', users);
routes.use('/api/training/', training);

// send landing page
routes.get('/', (req, res) => {

    var pagePath = path.resolve('front-end/views/index.html');
    res.sendFile(pagePath);

});

routes.get('/test', (req, res) => {

    var pagePath2 = path.resolve('front-end/views/index2.html');
    res.sendFile(pagePath2);

});

module.exports = routes;
