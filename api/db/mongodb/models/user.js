'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const userModel = new Schema({
    email: {
        type:       String,
        required:   true
    },
    password: {
        type:       String,
        required:   true
    },
    lastName:       String,
    firstName:      String,
    team:           String,
    accountType: {
        type:       String,
        enum:       ['coach', 'client', 'admin'],
        required:   true
    },
    memberStart:    Date,
    lastLogin:      Date
});

module.exports = mongoose.model('user', userModel);
