'use strict';

var User = require('../models/user');

module.exports = {

    /**
     * Mongo syntax to query for user(s).
     *
     * @param      {Object|string}  payload  The payload
     * @return     {Object}  The query result
     */
    user: function(payload) {

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

    }

};
