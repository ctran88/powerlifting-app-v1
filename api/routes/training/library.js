'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/training/library/:type endpoint.  Queries a single library type.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {
        
        var query = {
            type: req.params.type
        };

        get.library(query).then((result) => {

            if (!result) {
                res.status(404).send('No library found.');
            } else {
                // Should return an array of only 1 element, so hardcode first element
                res.status(200).json({
                    message: 'Library retrieved successfully.',
                    library: result[0]
                });
            }

        });

    },

    /**
     * Controller for /api/training/library/:type/:id endpoint.  Saves entry to a specific library type.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        get.library(req.params).then((found) => {

            if (found) {
                res.status(409).send('Library entry already exists.');
            } else {
                // create library entry from params
                post.library(req.params).then((result) => {

                    if (result) {
                        res.status(201).send('Library entry saved successfully.');
                    }

                });
            }
        })

    },

    /**
     * Controller for /api/training/library/:type/:id endpoint. Updates one library entry.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        patch.library(req.params, req.body.id).then((result) => {

            if (!result) {
                res.status(404).send('No library entry found');
            } else {
                res.status(200).send('Library entry updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/training/library/:type/:id endpoint. Deletes one library entry.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        remove.library(req.params).then((result) => {

            if (!result) {
                res.status(404).send('No library entry found');
            } else {
                res.status(200).send('Library entry deleted successfully.');
            }

        });

    }

};
