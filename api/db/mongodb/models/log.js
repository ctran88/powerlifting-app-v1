'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const logModel = new Schema({
    
});

module.exports = mongoose.model('log', logModel);
