'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const sessionModel = new Schema({
    metadata: {
        day: {
            type:       Number,
            min:        1,
            max:        7,
            required:   true
        }
    },
    mainLift: {
        type: String,
        enum: [
            'squat',
            'bench press',
            'deadlift'
        ]
    },
    mainVariationLibrary: {
        type: [
            String
        ],
        enum: [
            'low bar',
            'high bar',
            'front',
            'ssb',
            'duffalo',
            'pause',
            '1-ct pause',
            'tempo',
            'pin',
            'tng',
            'close grip',
            'board',
            'conventional',
            'sumo',
            'sldl',
            'snatch grip',
            'deficit',
            'block'
        ]
    },
    mainScheme: [
        {
            sets:           Number,
            reps:           Number,
            weight:         Number,
            rpe:            Number,
            percent: {
                type:       Number,
                of: {
                    type:   String,
                    enum: [
                        'ts',
                        '1rm'
                    ]
                }
            },
            backoff:        Boolean,
            workupSets:     Boolean
        }
    ],
    accessories: [
        {
            exercise:       String,
            sets:           Number,
            reps:           Number,
            weight:         Number,
            rpe:            Number,
            percent: {
                type:       Number,
                of: {
                    type:   String,
                    enum: [
                        'ts',
                        '1rm'
                    ]
                }
            },
            backoff:        Boolean,
            workupSets:     Boolean
        }
    ]
});

module.exports = mongoose.model('session', sessionModel);