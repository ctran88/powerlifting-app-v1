'use strict';
var app = module.exports = require('express')();
var fs = require('fs');
var path = require('path');
var config = require('./config/config').config;
var routes = require('./routes');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var validator = require('express-validator');
var cors = require('cors');

// import authentication config
var authConfig = require(path.join(__dirname, '/utils/authentication/', config.authentication, 'config'));

// set database connection to app locals property
app.locals.db = require(path.join(__dirname, '/db/', config.database, '/services/db-connection'));
app.locals.secret = config.secret;

// initialize logger
if (process.env.NODE_ENV !== 'test') {
    var logStream = fs.createWriteStream(path.join(__dirname, '/logs/log.log'), { flags: 'a' });

    app.use(morgan('common', { stream: logStream }));
    app.use(morgan('dev'));
}

// allow CORS
var corsOptions = {
    origin: 'https://192.168.54.54:8080',
    credentials: true
};
app.use(cors(corsOptions));

// initialize body-parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({

    extended: true

}));

// initialize express-validator middleware
app.use(validator({
    customValidators: {
        isArray: (value) => {

            return Array.isArray(value);

        },
        isArrayObjects: (array) => {

            return array.every((current, index) => {

                return typeof current === 'object';

            });

        },
        notEmptyArray: (array) => {

            return array.length > 0;
            
        }
    }
}));

// root path is /* and includes all routes located in 'routes' folder
app.use('/', routes);
