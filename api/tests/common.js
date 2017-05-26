'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var config = require('../config/config').config;

chai.use(chaiHttp);

exports.chai = chai;
exports.should = chai.should();

exports.server = require('../server');

exports.mongoose = require('mongoose');
exports.user = require(path.join(__dirname, '/../db/', config.database, '/models/user'));
