'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Microcycle = require('../models/microcycle');
var Session = require('../models/session');
var Log = require('../models/log');
var Library = require('../models/library');

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
     * Mongo syntax to create program.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    programs: function(payload) {

        var program = new Program(payload);

        return program.save().then((doc) => {

            var result = doc ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error saving program information:', err);

        });

    },

    /**
     * Mongo syntax to create microcycle.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    microcycles: function(payload) {

        var microcycle = new Microcycle(payload);

        return microcycle.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving microcycle information:', err);

        });

    },

    /**
     * Mongo syntax to create session.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    sessions: function(payload) {

        var session = new Session(payload);

        return session.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving session information:', err);

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

            var result = doc ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error saving log information:', err);

        });

    },

    /**
     * Mongo syntax to create a single library entry.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The delete result
     */
    library: function(payload) {
        
        var query = {
            type: payload.type
        };
        var payload = {
            $addToSet: {
                list: payload.id
            }
        };
        
        return Library.update(
            query,
            payload
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving library entry information:', err);

        });

    }

};
