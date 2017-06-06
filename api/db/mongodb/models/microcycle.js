'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Session = require('./session');

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const microcycleModel = new Schema({
    metadata: {
        week: {
            type:       Number,
            required:   true
        }
    },
    sessions: [
        Session.schema
    ]
});

module.exports = mongoose.model('microcycle', microcycleModel);
