'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Log = require('../models/log');

module.exports = {

    /**
     * Mongo syntax to delete a single user.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    users: function(payload) {

        var query = {
            'email': payload
        };

        return User.findOneAndRemove(
            query
        ).then((doc) => {

            var result = !doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting user information:', err);

        });

    },

    /**
     * Mongo syntax to delete a single program.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    programs: function(payload) {

        var query = payload;

        return Program.findOneAndRemove(
            query
        ).then((doc) => {

            var result = !doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting program information:', err);

        });

    },

    /**
     * Mongo syntax to delete a single log.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    logs: function(payload) {

        var query = payload;

        return Log.findOneAndRemove(
            query
        ).then((doc) => {

            var result = !doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting log information:', err);

        });

    }

};
