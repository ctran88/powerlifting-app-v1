'use strict';

// workaround for 'DEPTH_ZERO_SELF_SIGNED_CERT' error
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


/**
 * Import test separate test files into 'test' suite
 *
 * @param      {string}  name    The name of the test suite to import
 * @param      {string}  path    The path of the test file to import
 */
function importTest(name, path) {

    describe(name, function() {
        require(path);
    });
}

// require common modules
var common = require('./common');

// suppress mongoose logging output to console
common.mongoose.set('debug', false);

// top of test structure
// not using lambda function syntax because the lexical binding of 'this' prevents
// functions from accessing the Mocha context: https://mochajs.org/#arrow-functions
describe('test', function() {

    importTest('user', './user/user');

});
