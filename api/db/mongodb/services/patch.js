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
     * @param      {string}   id       The document id
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    programs: function(id, payload) {

        var query = id;
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Program.findByIdAndUpdate(
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
     * Mongo syntax to update microcycle.
     *
     * @param      {string}   id       The document id
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    microcycles: function(id, payload) {

        var query = id;
        var update = {
            $set: payload
        };
        var options = {
            new: true,
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
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    sessions: function(id, payload) {

        var query = id;
        var update = {
            $set: payload
        };
        var options = {
            new: true,
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
     * @param      {string}   id       The document id
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    logs: function(id, payload) {

        var query = id;
        var update = {
            $set: payload
        };
        var options = {
            new: true,
            runValidators: true
        };

        return Log.findByIdAndUpdate(
            query,
            update,
            options
        ).then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error updating log information:', err);

        });

    },

    /**
     * Mongo syntax to update a single library entry.
     *
     * @param      {Object}   query    The query
     * @param      {string}   payload  The payload
     * @return     {boolean}  The delete result
     */
    library: function(query, payload) {
        
        var query = {
            type: query.type
        };
        var deleteCondition = {
            $pull: {
                list: query.id
            }
        };
        var update = {
            $push: {
                list: payload
            }
        }
        
        // first delete original element
        return Library.update(
            query,
            deleteCondition
        ).then((doc) => {

            if (doc) {
                // then add new element to array
                return Library.update(
                    query,
                    update
                ).then((doc) => {

                    var result = doc ? true : false;
                    return result;

                }).catch((err) => {

                    console.error('Error updating library entry information:', err);

                });
            }

        }).catch((err) => {

            console.error('Error updating library entry information:', err);

        });

    }

};
