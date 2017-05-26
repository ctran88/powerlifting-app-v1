'use strict';

var Promise = require('bluebird');
var crypto = require('crypto');
var bcrypt = Promise.promisifyAll(require('bcrypt'));


/**
 * Hashes a plain text password using hmac + bcrypt
 *
 * @param      {String}  secret             The secret
 * @param      {String}  plainTextPassword  The plain text password
 * @return     {String}  The hashed password
 */
exports.hash = (secret, plainTextPassword) => {

    const algorithm = 'sha512';
    const encoding = 'hex';
    const saltRounds = 10;

    // hash password with hmac first
    var hmac = crypto.createHmac(algorithm, secret)
                     .update(plainTextPassword)
                     .digest(encoding);

    // then hash hmac result with bcrypt and return promise to caller
    return bcrypt.hashAsync(hmac, saltRounds).then((hash) => {

        return hash;

    });

};
