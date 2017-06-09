'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/training/sessions endpoint.  Queries one, many, or all sessions.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {

        // query sessions with json body
        get.sessions(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No sessions found.');
            } else {
                res.status(200).json({
                    message: 'Sessions retrieved successfully.',
                    sessions: result
                });
            }

        });

    },

    /**
     * Controller for /api/training/sessions endpoint.  Saves one session.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        // create session from json body
        post.sessions(req.body).then((found) => {

            if (found) {
                res.status(409).send('Session already exists.');
            } else {
                // save session to database
                post.sessions(req.body).then((result) => {

                    if (result) {
                        res.status(201).send('Session saved successfully.');
                    }

                });
            }

        });

    },

    /**
     * Controller for /api/training/sessions endpoint. Updates one session.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        patch.sessions(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No session found');
            } else {
                res.status(200).send('Session updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/training/sessions endpoint. Deletes one session.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        remove.sessions(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No session found');
            } else {
                res.status(200).send('Session deleted successfully.');
            }

        });

    }

};
