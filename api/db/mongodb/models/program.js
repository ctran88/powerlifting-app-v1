'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Microcycle = require('./microcycle');

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const programModel = new Schema({
    metadata: {
        name: {
            type:       String,
            required:   true
        },
        coach: {
            type:       String,
            required:   true
        },
        client:         String,
        status: {
            type:       String,
            enum: [
                'draft',
                'published'
            ],
            required:   true
        },
        active:         Boolean,
        created:        Date,
        lastUpdated:    Date,
        cycle:          Number
    },
    microcycles: [
        Microcycle.schema
    ]
});

module.exports = mongoose.model('program', programModel);
