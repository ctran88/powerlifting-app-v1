'use strict';

var User = require('../models/user');

module.exports = {

    /**
     * Mongo syntax to query for user(s).
     *
     * @param      {Object}  payload  The payload
     * @return     {Object}  The query result
     */
    user: function(payload) {

        var user = new User(payload);

        return user.save().then((doc) => {

            var result = doc ? true : false;
            return result;

        }).catch((err) => {

            console.error('Error saving user information:', err);

        });

    }

};
