'use strict';

var User = require('../models/user');
var Program = require('../models/program');
var Log = require('../models/log');

module.exports = {

    /**
     * Mongo syntax to update user.
     *
     * @param      {Object}   payload  The payload
     * @return     {boolean}  The update result
     */
    users: function(payload) {

        var query = {
            'email': payload.email
        };
        var update = new User(payload);
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
        var update = new Program(payload);
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
        var update = new Log(payload);
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
