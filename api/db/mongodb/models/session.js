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
            variations:     String,
            sets:           Number,
            reps:           Number,
            rpe:            Number,
            percent:        Number,
            percentOf:      String,
            weight:         Number,
            workupSets:     Boolean
        }
    ],
    accessories: [
        {
            exercise:       String,
            variations:     String,
            sets:           Number,
            reps:           Number,
            rpe:            Number,
            percent:        Number,
            percentOf:      String,
            weight:         Number,
            workupSets:     Boolean
        }
    ],
    rest:                   Boolean
});

module.exports = mongoose.model('session', sessionModel);
