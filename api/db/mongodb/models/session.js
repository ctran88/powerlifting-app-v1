'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const sessionModel = new Schema({
    metadata: {
        day: {
            type:           Number,
            min:            1,
            max:            7,
            required:       true
        }
    },
    main: [
        {
            exercise:       String,
            variation:      String,
            sets:           Number,
            reps:           Number,
            rpe:            Number,
            percent:        Number,
            percentOf:      String,
            weight:         Number,
            workupSets:     Boolean,
            backoff:        Boolean
        }
    ],
    accessories: [
        {
            exercise:       String,
            variation:      String,
            sets:           Number,
            reps:           Number,
            rpe:            Number,
            percent:        Number,
            percentOf:      String,
            weight:         Number,
            workupSets:     Boolean,
            backoff:        Boolean
        }
    ],
    rest:                   Boolean
});

module.exports = mongoose.model('session', sessionModel);
