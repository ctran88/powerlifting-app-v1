'use strict';

var Promise = require('bluebird');
var crypto = require('crypto');
var bcrypt = Promise.promisifyAll(require('bcrypt'));
var config = require('../config/config').config;

module.exports = {

    /**
     * Hashes a plain tesxt password using hmac
     *
     * @param      {string}  plainTextPassword  The plaintext password
     * @return     {string}  The hashed password
     */
    hashHmac: function(plainTextPassword) {

        const algorithm = 'sha512';
        const encoding = 'hex';

        var hmac = crypto.createHmac(algorithm, config.secret)
                         .update(plainTextPassword)
                         .digest(encoding);

        return hmac;

    },

    /**
      * Hashes a plain text password using hmac + bcrypt
      *
      * @param      {string}  plainTextPassword  The plaintext password
      * @return     {Promise}  The promise containing the hashed password
      */ 
    hashBcrypt: function(plainTextPassword) {

        const saltRounds = 10;

        // hash password with hmac first
        var hmac = this.hashHmac(plainTextPassword);

        return bcrypt.hashAsync(hmac, saltRounds);

    },

    /**
     * Compares plaintext password with stored hashed password
     *
     * @param      {string}   plainTextPassword  The plaintext password
     * @param      {string}   storedPassword     The stored password hash
     * @return     {boolean}  Comparison result
     */
    compare: function(plainTextPassword, storedPassword) {

        var hmac = this.hashHmac(plainTextPassword);

        return bcrypt.compareAsync(hmac, storedPassword);

    }

};
