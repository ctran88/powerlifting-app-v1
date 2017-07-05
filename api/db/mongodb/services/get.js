'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Microcycle = require('../models/microcycle');
var Session = require('../models/session');
var Log = require('../models/log');
var Library = require('../models/library');

module.exports = {

    /**
     * Mongo syntax to query a single user for password comparison.
     * Used for login password comparison.
     *
     * @param      {string}  payload  The payload
     * @return     {Object}  The query result
     */
    userWithPass: function(payload) {

        var query = {
            email: payload
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
        var clientPopulation = '';

        // query for many users or single user
        if (typeof payload === 'object') {
            query = payload;
        } else if (typeof payload === 'string') {
            query = {
                email: payload
            };
            clientPopulation = {
                path: '_clients',
                match: {
                    coach: payload
                }
            };
        }
        
        var projection = {
            '__v': 0,
            'password': 0
        };
        var programPopulation = {
            path: '_activeProgram',
            match: {
                'metadata.active': true
            }
        };

        return User.find(
            query,
            projection
        ).populate(
            programPopulation
        ).populate(
            clientPopulation
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
     * @param      {Object}  payload  The payload
     * @return     {Object}  The query result
     */
    programs: function(payload) {

        var query = payload;
        var queryKeys = Object.keys(query);
        var queryValues = queryKeys.map((key) => query[key]);

        // if query key/value is array, format to mongo query syntax
        for (var i = 0; i < queryKeys.length; i++) {
            if (Array.isArray(queryValues[i])) {
                query[queryKeys[i]] = {
                    $in: queryValues[i]
                };
            }
        }

        var projection = {
            '__v': 0
        };

        return Program.find(
            query,
            projection
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving program information:', err);

        });

    },

    /**
     * Mongo syntax to query for microcycle(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    microcycles: function(payload) {

        // query for single, many, or all microcycles
        var query = payload;
        var projection = {
            '__v': 0
        };

        return Microcycle.find(
            query,
            projection
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving microcycle information:', err);

        });

    },

    /**
     * Mongo syntax to query for session(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    sessions: function(payload) {

        // query for single, many, or all sessions
        var query = payload;
        var projection = {
            '__v': 0
        };

        return Session.find(
            query,
            projection
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving session information:', err);

        });

    },

    /**
     * Mongo syntax to query for log(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    logs: function(payload) {

        var query = {};
        
        // assumes payload is session id
        if (payload._session) {
            query = {
                'metadata._session': payload._session
            };
        }

        var projection = {
            '__v': 0
        };
        var programPopulation = {
            path: 'program'
        };
        var microcyclePopulation = {
            path: 'microcycle'
        };
        var sessionPopulation = {
            path: '_session'
        };
        
        return Log.find(
            query,
            projection
        ).populate(
            programPopulation
        ).populate(
            microcyclePopulation
        ).populate(
            sessionPopulation
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error retrieving log information:', err);

        });

    },

    /**
     * Mongo syntax to get a single library type.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    library: function(payload) {

        var query = payload;
        var projection = {
            '__v': 0
        };
        
        return Library.find(
            query,
            projection
        ).then((doc) => {

            var result = doc.length > 0 ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting library entry information:', err);

        });

    }

};
