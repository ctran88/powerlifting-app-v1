'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Mesocycle = require('../models/mesocycle');
var Microcycle = require('../models/microcycle');
var Session = require('../models/session');
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
     * Mongo syntax to create program.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    programs: function(payload) {

        var program = new Program(payload);

        return program.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving program information:', err);

        });

    },

    /**
     * Mongo syntax to create mesocycle.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The creation result
     */
    mesocycles: function(payload) {

        var mesocycle = new Mesocycle(payload);

        return mesocycle.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving mesocycle information:', err);

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

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving log information:', err);

        });

    }

};
