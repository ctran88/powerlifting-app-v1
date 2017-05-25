'use strict';

const env = require('../env');

exports.config = (function() {

    // Set environment
    const nodeEnv = process.env.NODE_ENV || 'development';

    // Set environmental variables from command line
    // TODO: Environment does not change command line variables
    env[nodeEnv]['db'] = process.env.DB;
    env[nodeEnv]['secret'] = process.env.AUTH_SECRET;
    env[nodeEnv]['logLevel'] = process.env.LOG_LEVEL;

    // Set storage system if using cookies for authentication
    if (env[nodeEnv]['authentication'] == 'cookies') {
        env[nodeEnv]['sessionStore'] = 'sessions';
    }

    return env[nodeEnv];

}());
