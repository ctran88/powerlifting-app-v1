'use strict';
var app = module.exports = require('express')();
var path = require('path');
var config = require('./config/config').config;
var routes = require('./routes');
var morgan = require('morgan');
var bodyParser = require('body-parser');

// import authentication config
var authConfig = require(path.join(__dirname, '/utils/authentication/', config.authentication, 'config'));

// set database connection to app locals property
app.locals.db = require(path.join(__dirname, '/db/', config.database, '/services/db-connection'));
app.locals.secret = config.secret;

// initialize logger
app.use(morgan('dev'));

// initialize body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({

    extended: true

}));

// root path is /* and includes all routes located in 'routes' folder
app.use('/', routes);
