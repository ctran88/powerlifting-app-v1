'use strict';

const mongoose = require('mongoose');
const config = require('../../../config/config').config;
mongoose.set('debug', true);

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

exports.connect = () => {

    // Start MongoDB connection
    mongoose.connect(config.db);
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error'));
    db.once('open', () => {

        if (process.env.NODE_ENV !== 'test') {
            console.log('Successfully connected to MongoDB database: ' + db.name);
        }

    });

};
