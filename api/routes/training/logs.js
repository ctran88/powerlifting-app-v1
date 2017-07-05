'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/training/logs endpoint.  Queries one, many, or all logs.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {

        get.logs(req.query).then((result) => {

            if (!result) {
                res.status(404).send('No logs found.');
            } else {
                res.status(200).json({
                    message: 'Logs retrieved successfully.',
                    logs: result
                });
            }

        });

    },

    /**
     * Controller for /api/training/logs endpoint.  Saves one log.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        post.logs(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No log found');
            } else {
                res.status(201).json({
                    message: 'Log saved successfully.',
                    log: result
                });
            }

        });

    },

    /**
     * Controller for /api/training/logs endpoint. Updates one log.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        var payload = {
            query: req.params.id,
            update: req.body
        };

        patch.logs(payload).then((result) => {

            if (!result) {
                res.status(404).send('No log found');
            } else {
                res.status(200).send('Log updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/training/logs endpoint. Deletes one log.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        remove.logs(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No log found');
            } else {
                res.status(200).send('Log deleted successfully.');
            }

        });

    }

};
