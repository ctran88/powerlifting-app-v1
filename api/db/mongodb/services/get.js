'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Log = require('../models/log');

module.exports = {

    /**
     * Mongo syntax to query a single user for password comparison.
     * Used for login password comparison.
     *
     * @param      {string}  email  The email
     * @return     {Object}  The query result
     */
    userWithPass: function(email) {

        var query = {
            'email': email
        };
        
        var projection = {
            '__v': 0
        };

        return User.findOne(
            query,
            projection
        ).then((doc) => {

            var result = doc ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving user information:', err);

        });

    },

    /**
     * Mongo syntax to query for user(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    users: function(payload) {

        // query value for all users
        var query = {};

        // query for many users or single user
        if (typeof payload === 'object') {
            query = payload;
        } else if (typeof payload === 'string') {
            query = {
                'email': payload
            };
        }
        
        var projection = {
            '__v': 0,
            'password': 0
        };

        return User.find(
            query,
            projection
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving user information:', err);

        });

    },

    /**
     * Mongo syntax to query for program(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    programs: function(payload) {

        // query for single, many, or all programs
        var query = payload;

        return Program.find(
            query
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving program information:', err);

        });

    },

    /**
     * Mongo syntax to query for log(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    logs: function(payload) {

        // query for single, many, or all logs
        var query = payload;

        return Log.find(
            query
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving log information:', err);

        });

    }

};
