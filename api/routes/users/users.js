'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/users endpoint.  Queries many or all users.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    getMany: function(req, res) {
        var query = {};

        if (req.query) {
            if (Array.isArray(req.query.email)) {
                query = {
                    email: {
                        $in: req.query.email
                    }
                };
            } else {
                query = req.query;
            }
        }

        // query users with json body
        get.users(query).then((result) => {

            if (!result) {
                res.status(404).send('No users found.');
            } else {
                res.status(200).json({
                    message: 'Users retrieved successfully.',
                    users: result
                });
            }

        });

    },

    /**
     * Controller for /api/users/:email endpoint.  Queries one user.
     *
     * @param      {Object}    req     The request
     * @param      {Object}    res     The response
     * @param      {Function}  next    The next
     */
    getOne: function(req, res, next) {

        var query = req.params.email;

        get.users(query).then((result) => {

            if (result.length  === 0) {
                res.status(404).send('No user found.');
            } else {
                // if user is a coach, fill clients array
                if (result[0].accountType === 'coach') {
                    var clientQuery = {
                        coach: result[0].email
                    };

                    // get all clients with this user as a coach
                    get.users(clientQuery).then((result) => {

                        var payload = {
                            query: query,
                            update: {
                                $set: {
                                    _clients: result.map((el) => el._id)
                                }
                            }
                        };

                        // set clients array
                        patch.users(payload).then((result) => {

                        }).catch((error) => {

                            return next(new Error([error]));

                        });
                        
                    });
                }

                res.status(200).json({
                    message: 'User retrieved successfully.',
                    user: result
                });
            }

        });

    },

    /**
     * Controller for /api/users endpoint.  Saves one user.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        var query = req.body.email;

        // check if user already exists
        get.users(query).then((found) => {

            if (found) {
                res.status(409).send('User already exists.');
            } else {
                var payload = req.body;

                // does not exist, so post user
                post.users(payload).then((result) => {

                    if (result) {
                        res.status(201).send('User saved successfully.');
                    }

                });
            }

        });

    },

    /**
     * Controller for /api/users endpoint. Updates one user.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        var payload = {
            query: req.params.email,
            update: req.body
        };

        patch.users(payload).then((result) => {

            if (!result) {
                res.status(404).send('No user found');
            } else {
                res.status(200).send('User updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/users endpoint. Deletes one user.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {

        var query = req.params.email;
        
        remove.users(query).then((result) => {

            if (!result) {
                res.status(404).send('No user found');
            } else {
                res.status(200).send('User deleted successfully.');
            }

        });

    }

};
