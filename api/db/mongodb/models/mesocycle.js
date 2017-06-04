'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Microcycle = require('microcycle');

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const mesocycleModel = new Schema({
    metadata: {
        name: String,
        cycle: Number
    },
    microcycles: [
        Microcycle.schema
    ]
});

module.exports = mongoose.model('mesocycle', mesocycleModel);
