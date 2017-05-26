'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/authentication/session endpoint.  Generates a cookie
     * with a session id upon successful login.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        var sess = req.session;

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
                        req.session.login(req.body.email, function(err) {

                            if (err) {
                                res.status(500).send('There was an error logging in. Please try again later.');
                            } else {
                                res.status(200).send('Login successful.');
                            }

                        });
                    }

                });
            }

        });

    },

    /**
     * Controller for /api/authentication/session endpoint.  Destroys session.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        req.session.destroy(function(err) {

            if (err) {
                console.log(err);
            } else {
                res.status(200).redirect('/');
            }

        });

    }

};
