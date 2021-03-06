'use strict';

// workaround for 'DEPTH_ZERO_SELF_SIGNED_CERT' error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// suppress mongoose logging output to console
mongoose.set('debug', false);

// top of test structure
// not using lambda function syntax because the lexical binding of 'this' prevents
// functions from accessing the Mocha context: https://mochajs.org/#arrow-functions
describe('top', function() {

    describe('/api/authentication/sessions', function() {
        require('./authentication/sessions/get');
        require('./authentication/sessions/post');
        require('./authentication/sessions/delete');
    });

    describe('/api/users', function() {
        require('./users/get');
        require('./users/post');
        require('./users/patch');
        require('./users/delete');
    });

});
