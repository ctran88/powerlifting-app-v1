'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Microcycle = require('../models/microcycle');
var Session = require('../models/session');
var Log = require('../models/log');
var Library = require('../models/library');

module.exports = {

    /**
     * Mongo syntax to delete a single user.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    users: function(payload) {

        var query = {
            email: payload
        };

        return User.findOneAndRemove(
            query
        ).then((doc) => {

            var result = doc ? true : false;
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

        return Program.findByIdAndRemove(
            query
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting program information:', err);

        });

    },

    /**
     * Mongo syntax to delete a single microcycle.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    microcycles: function(payload) {

        var query = payload;

        return Microcycle.findByIdAndRemove(
            query
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting microcycle information:', err);

        });

    },

    /**
     * Mongo syntax to delete a single session.
     *
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    sessions: function(payload) {

        var query = payload;

        return Session.findByIdAndRemove(
            query
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting session information:', err);

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

        return Log.findByIdAndRemove(
            query
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting log information:', err);

        });

    },

    /**
     * Mongo syntax to delete a single library entry.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The delete result
     */
    library: function(payload) {
        
        var query = {
            type: payload.type
        };
        var deleteCondition = {
            $pull: {
                list: payload.id
            }
        };

        return Library.update(
            query,
            deleteCondition
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error deleting library entry information:', err);

        });

    }

};
