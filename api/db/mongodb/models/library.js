'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const libraryModel = new Schema({
    type: {
        type:       String,
        required:   true
    },
    list: {
        type:       Array,
        unique:     true
    }
});

module.exports = mongoose.model('library', libraryModel);
