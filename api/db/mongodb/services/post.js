'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Log = require('../models/log');

module.exports = {

    /**
     * Mongo syntax to create user.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    users: function(payload) {

        var user = new User(payload);

        return user.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving user information:', err);

        });

    },

    /**
     * Mongo syntax to create log.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    logs: function(payload) {

        var log = new Log(payload);

        return log.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving log information:', err);

        });

    }

};
