'use strict';

var config = require('../../config/config').config;
var path = require('path');
var hash = require('../../utils/hash').hash;
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/user endpoint.  Queries many or all users.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    getMany: function(req, res) {

        // query users with json body
        get.user(req.body).then((result) => {

            if (!result) {
                res.status(404).json({
                    message: 'No users found.'
                });
            } else {
                res.status(200).json({
                    message: 'Users retrieved successfully.',
                    users: result
                });
            }

        });

    },

    /**
     * Controller for /api/user/:email endpoint.  Queries one user.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    getOne: function(req, res) {

        // query user with url params
        get.user(req.params.email).then((result) => {

            if (!result) {
                res.status(404).json({
                    message: 'No user found.'
                });
            } else {
                res.status(200).json({
                    message: 'User retrieved successfully.',
                    user: result
                });
            }

        });

    },

    /**
     * Controller for /api/user endpoint.  Saves one user.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        // query user with email from json body
        get.user(req.body.email).then((found) => {

            if (found) {
                res.status(409).json({
                    message: 'User already exists.'
                });
            } else {
                var userInfo = req.body;

                // hash plain text password
                hash(config.secret, userInfo.password).then((hash) => {
                    
                    userInfo.password = hash;

                    // save user to database
                    post.user(userInfo).then((result) => {

                        if (result) {
                            res.status(201).json({
                                message: 'User saved successfully.'
                            });
                        }

                    });
                    
                });

            }

        });

    },

    patch: function(req, res) {
        
    },

    delete: function(req, res) {
        
    }

};
