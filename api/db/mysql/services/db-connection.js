'use strict';

var Sequelize = require('sequelize');
var config = require('../../../config/config').config;

// initialize database connection
var sequelize = new Sequelize(
    config.db,
    { logging: console.log }
);

exports.connect = () => {

    // check connection status
    sequelize.authenticate()
        .then(() => {

            console.log('Successfully connected to MySQL.');
        
        }).catch((err) => {

            console.log('MySQL connection error: ' + err);

        });
    
};
