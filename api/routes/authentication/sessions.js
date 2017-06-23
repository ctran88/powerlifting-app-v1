'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/authentication/sessions endpoint.  Retrieves session
     * information.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {

        if (req.session.userInfo) {
            // get user information
            get.users(req.session.userInfo).then((result) => {

                if (result) {
                    res.status(200).json({
                        message: req.session.userInfo,
                        info: result[0]
                    });
                }

            });
        } else {
            res.status(200).send('Not signed in.');
        }

    },

    /**
     * Controller for /api/authentication/sessions endpoint.  Generates a cookie
     * with a session id upon successful signin.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        // query for user with email string
        get.userWithPass(req.body.email).then((result) => {

            // if user is not in database
            if (!result) {
                res.status(401).send('Invalid email and/or password.');
            } else {
                // compare passwords
                result.passwordIsValid(req.body.password).then((valid) => {

                    // if user password does not match
                    if (!valid) {
                        res.status(401).send('Invalid email and/or password.');
                    } else {
                        // attach user email to session
                        req.session.signin(req.body.email, (err) => {

                            if (err) {
                                res.status(500).send('There was an error signing in. Please try again later.');
                            } else {
                                // get user information without password field
                                get.users(req.body.email).then((result) => {

                                    if (result) {
                                        res.status(200).json({
                                            message: 'Signin successful.',
                                            info: result[0]
                                        });
                                    }

                                });
                            }

                        });
                    }

                });
            }

        });

    },

    /**
     * Controller for /api/authentication/sessions endpoint.  Destroys session.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        // destroy session from store
        req.session.destroy((err) => {

            if (err) {
                console.log(err);
            } else {
                res.status(200).send('Signout successful.');
            }

        });

    }

};
