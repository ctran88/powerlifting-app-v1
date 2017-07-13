'use strict';

var functions = require('firebase-functions');
var admin = require('firebase-admin');
var crypto = require('crypto');
var bcrypt = require('bcrypt');
var uuidv4 = require('uuid/v4');
var csprng = require('csprng');
var cors = require('cors')({origin: true});

/**
 * Handles https trigger for hash function.
 *
 * @param      {Object}  req     The request
 * @param      {Object}  res     The resource
 */
exports.handler = (req, res) => {
  if (req.method === 'PUT') {
    res.status(403).send('Forbidden!');
  }

  cors(req, res, () => {
    var uuid = generateUuid();
    var invite = {
      link: uuid, // invitation link
      clientEmail: req.body.clientEmail, // client email
      client: req.body.client, // client name
      coachEmail: req.body.coachEmail,
      coach: req.body.coach, // coach name
      team: req.body.team, // team name
      created: req.body.created // created date
    };

    admin.database().ref('/invites').push(invite)
      .then((snapshot) => {
        res.status(200).send('Invitation was sent successfully.');
      })
      .catch((error) => {
        res.status(500).send('There was an error sending the invitation.');
      });
  });
};

/**
 * Hashes a plain text string using hmac
 *
 * @param      {string}  plaintext  The plaintext string
 * @return     {string}  The hashed string
 */
function hashHmac(plaintext) {
  const algorithm = 'sha512';
  const encoding = 'hex';

  return crypto.createHmac(algorithm, functions.config().auth.secret)
               .update(plaintext)
               .digest(encoding);
}

/**
 * Hashes a plain text coach uid and client email using hmac + bcrypt
 *
 * @param      {string}   coachUid     The coach uid
 * @param      {string}   clientEmail  The client email
 * @param      {string}   date         The date
 * @return     {Promise}  The promise containing the hashed string
 */
function hashBcrypt(coachUid, clientEmail, date) {
  const saltRounds = 10;

  // hash strings with hmac first
  var hmac = hashHmac(coachUid + clientEmail + date);

  return bcrypt.hash(hmac, saltRounds);
}

/**
 * Creates a v4 uuid (underlying rng is crypto.randomBytes)
 *
 * @return     {string}  uuidv4
 */
function generateUuid() {
  return uuidv4();
}

/**
 * Creates a random string (underlying rng is crypto.randomBytes) that should follow csprng standards
 *
 * @return     {string}  random string
 */
function generateCsprng() {
  return csprng();
}
