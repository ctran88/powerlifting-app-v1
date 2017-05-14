'use strict';

var express = require('express');
var app = express();
var config = require('./config/config').config;
var path = require('path');

// set database connection to app locals property
app.locals.db = require(path.join(__dirname, '/db/', config.database, '/services/db-connection'));

module.exports = app;
