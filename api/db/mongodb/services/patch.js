'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Microcycle = require('../models/microcycle');
var Session = require('../models/session');
var Log = require('../models/log');
var Library = require('../models/library');

module.exports = {

    /**
     * Mongo syntax to update user.
     *
     * @param      {Object}   payload  The query and update
     * @return     {boolean}  The update result
     */
    users: function(payload) {

        var query = {
            email: payload.query
        };
        var update = payload.update;
        var options = {
            new: true,
            runValidators: true
        };

        return User.findOneAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error updating user information:', err);

        });

    },

    /**
     * Mongo syntax to update program.
     *
     * @param      {Object}   payload  The query and update (entire document)
     * @return     {boolean}  The update result
     */
    programs: function(payload) {

        var query = {
            _id: payload.query
        };
        var update = payload.update;
        var options = {
            new: true,
            overwrite: true,
            runValidators: true
        };

        return Program.findByIdAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? doc : false;
            return result;

        }).catch((err) => {

            console.error('Error updating program information:', err);

        });

    },

    /**
     * Mongo syntax to update all of a client's programs with the active field set to false.
     *
     * @param      {Object}   payload  The query and update
     * @return     {boolean}  The update result
     */
    programsMany: function(payload) {

        var query = {
            'metadata.client': payload.query
        };
        var update = {
            'metadata.active': payload.update.active
        };
        var options = {
            multi: true,
            runValidators: true
        };

        return Program.update(
            query,
            update,
            options
        ).then((raw) => {

            var result = raw ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating program information:', err);

        });

    },

    /**
     * Mongo syntax to update microcycle.
     *
     * @param      {string}   id       The document id
     * @param      {Object}   payload  The entire document, not just updates
     * @return     {boolean}  The update result
     */
    microcycles: function(id, payload) {

        var query = id;
        var update = payload;
        var options = {
            new: true,
            overwrite: true,
            runValidators: true
        };

        return Microcycle.findByIdAndUpdate(
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
     * @param      {string}   id       The document id
     * @param      {Object}   payload  The entire document, not just updates
     * @return     {boolean}  The update result
     */
    sessions: function(id, payload) {

        var query = id;
        var update = payload;
        var options = {
            new: true,
            overwrite: true,
            runValidators: true
        };

        return Session.findByIdAndUpdate(
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
     * @param      {Object}   payload  The query and update
     * @return     {boolean}  The update result
     */
    logs: function(payload) {

        var query = {
            _id: payload.query
        };
        var update = payload.update;
        var options = {
            overwrite: true,
            runValidators: true
        };

        return Log.update(
            query,
            update,
            options
        ).then((raw) => {

            var result = raw ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating log information:', err);

        });

    },

    /**
     * Mongo syntax to update a library entry.
     *
     * @param      {Object}   payload  The query and update (entire array)
     * @return     {boolean}  The update result
     */
    library: function(payload) {
        
        var query = {
            'type': payload.query
        };
        var update = payload.update;
        var options = {
            overwrite: true,
            runValidators: true
        };
        
        return Library.update(
            query,
            update,
            options
        ).then((raw) => {

            var result = raw ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating library information:', err);

        });

    }

};
