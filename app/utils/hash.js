'use strict';

var crypto = require('crypto');
// var bcrypt = require('bcrypt');

module.exports = {
  /**
   * Hashes a plain text string using hmac
   *
   * @param      {string}  plaintext  The plaintext string
   * @return     {string}  The hashed string
   */
  hashHmac: function(plaintext) {
    const algorithm = 'sha512';
    const encoding = 'hex';

    var hmac = crypto.createHmac(algorithm, process.env.SECRET)
                     .update(plaintext)
                     .digest(encoding);

    return hmac;
  },

  /**
     * Hashes a plain text coach uid and client email using hmac + bcrypt
     *
     * @param      {string}   coachUid     The coach uid
     * @param      {string}   clientEmail  The client email
     * @param      {string}   date         The date
     * @return     {Promise}  The promise containing the hashed string
     */
  hashBcrypt: function(coachUid, clientEmail, date) {
    // const saltRounds = 10

    //     // hash strings with hmac first
    // var hmac = this.hashHmac(coachUid + clientEmail + date)

        // return bcrypt.hash(hmac, saltRounds);
  },

  /**
   * Compares plaintext password with stored hashed password
   *
   * @param      {string}   plainTextPassword  The plaintext password
   * @param      {string}   storedPassword     The stored password hash
   * @return     {boolean}  Comparison result
   */
  compare: function(plainTextPassword, storedPassword) {
    // var hmac = this.hashHmac(plainTextPassword)

        // return bcrypt.compare(hmac, storedPassword);
  }
};
