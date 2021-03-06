'use strict';

var chai = require('chai');
var chaiHttp = require('chai-http');
var path = require('path');
var config = require('../config/config').config;

chai.use(chaiHttp);

global.server = require('../server');

global.chai = chai;
global.should = chai.should();

global.mongoose = require('mongoose');
global.User = require(path.join(__dirname, '/../db/', config.database, '/models/user'));
global.Session = require(path.join(__dirname, '/../db/', config.database, '/models/session'));
global.Microcycle = require(path.join(__dirname, '/../db/', config.database, '/models/microcycle'));
global.Mesocycle = require(path.join(__dirname, '/../db/', config.database, '/models/mesocycle'));
global.Program = require(path.join(__dirname, '/../db/', config.database, '/models/program'));
global.Log = require(path.join(__dirname, '/../db/', config.database, '/models/log'));
