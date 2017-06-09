'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Mesocycle = require('../models/mesocycle');
var Microcycle = require('../models/microcycle');
var Session = require('../models/session');
var Log = require('../models/log');

module.exports = {

    /**
     * Mongo syntax to update user.
     *
     * @param      {string}   email    The email
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    users: function(email, payload) {

        var query = {
            'email': email
        };
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return User.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating user information:', err);

        });

    },

    /**
     * Mongo syntax to update program.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    programs: function(payload) {

        // TODO: UPDATE THIS QUERY
        var query = {
            'email': payload.email
        };
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Program.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating program information:', err);

        });

    },

    /**
     * Mongo syntax to update mesocycle.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    mesocycles: function(payload) {

        // TODO: UPDATE THIS QUERY
        var query = {
            'email': payload.email
        };
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Mesocycle.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating mesocycle information:', err);

        });

    },

    /**
     * Mongo syntax to update microcycle.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    microcycles: function(payload) {

        // TODO: UPDATE THIS QUERY
        var query = {
            'email': payload.email
        };
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Microcycle.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating microcycle information:', err);

        });

    },

    /**
     * Mongo syntax to update session.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    sessions: function(payload) {

        // TODO: UPDATE THIS QUERY
        var query = {
            'email': payload.email
        };
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Session.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating session information:', err);

        });

    },

    /**
     * Mongo syntax to update log.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    logs: function(payload) {

        // TODO: UPDATE THIS QUERY
        var query = {
            'email': payload.email
        };
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Log.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating log information:', err);

        });

    }

};
