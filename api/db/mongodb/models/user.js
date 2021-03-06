'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const hash = require('../../../utils/hash');

// Use Bluebird for mongoose promise library
mongoose.Promise = require('bluebird');

const userModel = new Schema({
    email: {
        type:       String,
        unique:     true,
        required:   true
    },
    password: {
        type:       String,
        required:   true
    },
    lastName:       String,
    firstName:      String,
    team:           String,
    accountType: {
        type:       String,
        enum: [
            'coach',
            'client',
            'admin'
        ],
        required:   true
    },
    coach:          String,
    _activeProgram: {
        type: Schema.Types.ObjectId,
        ref: 'program'
    },
    _clients: [
        {
            type: Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    memberStart: {
        type:       Date,
        required:   true
    },
    lastLogin:      Date
});

// pre- hook to hash plaintext password
userModel.pre('save', function(next) {

    if (!this.isModified('password')) {
        return next();
    }

    hash.hashBcrypt(this.password).then((hashed) => {

        this.password = hashed;
        next();
        
    }).catch((error) => {

        console.log('Error with user pre-save hook: ', error);
        
    });

});

userModel.methods.passwordIsValid = function(plainTextPassword) {

    return hash.compare(plainTextPassword, this.password);

};

module.exports = mongoose.model('user', userModel);
