'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const logModel = new Schema({
    metadata: {
        date: Date,
        _program: {
            type: Schema.Types.ObjectId,
            ref: 'program'
        },
        _microcycle: {
            type: Schema.Types.ObjectId,
            ref: 'microcycle'
        },
        _session: {
            type: Schema.Types.ObjectId,
            ref: 'session'
        }
    },
    weighIn:                Number,
    main: [
        {
            exercise:       String,
            variations:     String,
            sets:           Number,
            reps:           Number,
            weight:         Number,
            rpe:            Number
        }
    ],
    accessories: [
        {
            exercise:       String,
            variations:     String,
            sets:           Number,
            reps:           Number,
            weight:         Number,
            rpe:            Number
        }
    ]
});

module.exports = mongoose.model('log', logModel);
