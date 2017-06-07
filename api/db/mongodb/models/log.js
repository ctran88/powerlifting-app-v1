'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const logModel = new Schema({
    metadata: {
        date: Date,
        program: {
            type: Schema.Types.ObjectId,
            ref: 'program'
        },
        mesocycle: {
            type: Schema.Types.ObjectId,
            ref: 'mesocycle'
        },
        microcycle: {
            type: Schema.Types.ObjectId,
            ref: 'microcycle'
        },
        session: {
            type: Schema.Types.ObjectId,
            ref: 'session'
        }
    },
    log: {
        weighin:            Number,
        mainLift: [
            {
                exercise: {
                    type: String,
                    enum: [
                        'squat',
                        'bench press',
                        'deadlift'
                    ]
                },
                variation:  [String],
                sets:       Number,
                reps:       Number,
                weight:     Number,
                rpe:        Number,
                backoff:    Boolean,
                workupSets: Boolean
            }
        ],
        accessory: [
            {
                exercise:   String,
                sets:       Number,
                reps:       Number,
                weight:     Number,
                rpe:        Number,
                backoff:    Boolean,
                workupSets: Boolean
            }
        ]
    }
});

module.exports = mongoose.model('log', logModel);
