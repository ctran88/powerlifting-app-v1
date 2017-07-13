'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const hashModule = require('./hash');
const mailerModule = require('./mailer');

// initialize connection to database
admin.initializeApp(functions.config().firebase);

exports.hash = functions.https.onRequest(hashModule.handler);
exports.mailer = functions.database.ref('/invites/{.key}').onCreate(mailerModule.handler);
