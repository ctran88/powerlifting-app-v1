'use strict';

const env = require('../env');

exports.config = (function() {

    // Set environment
    const nodeEnv = process.env.NODE_ENV || 'development';

    // Set environmental variables from command line
    env[nodeEnv]['db'] = process.env.DB;
    env[nodeEnv]['secret'] = process.env.AUTH_SECRET;
    env[nodeEnv]['logLevel'] = process.env.LOG_LEVEL;

    return env[nodeEnv];

}());
