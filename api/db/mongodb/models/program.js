'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mesocycle = require('./mesocycle');

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
                'template',
                'draft',
                'published'
            ],
            required:   true
        },
        created:        Date,
        lastUpdated:    Date
    },
    mesocycles: [
        Mesocycle.schema
    ]
});

module.exports = mongoose.model('program', programModel);
