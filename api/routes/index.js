'use strict';

var routes = require('express').Router();
var authentication = require('./authentication');
var user = require('./user');
var path = require('path');

// add subroute trees with root path as /api/*
routes.use('/api/authentication/', authentication);
routes.use('/api/user/', user);

// set initial view count for cookies
routes.get('/', (req, res, next) => {

    if (typeof req.session.poofy === 'undefined') {
        req.session.poofy = 1;
    }

    return next();

});

// increment view count for cookies
routes.get('/', (req, res, next) => {

    console.assert(typeof req.session.poofy === 'number', 'missing views count in the session', req.session);
    req.session.poofy++;

    return next();

});

// send page with view counter
routes.get('/', (req, res) => {

    // res.setHeader('Content-Type', 'text/html');
    // res.setHeader('Referer', 'server referer');
    // res.write('<p>views: ' + req.session.views + '</p>\n');
    // res.end();

    var pagePath = path.resolve('../front-end/views/index.html');
    res.sendFile(pagePath);

});

module.exports = routes;
