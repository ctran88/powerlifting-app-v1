'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/training/microcycles endpoint.  Queries one, many, or all microcycles.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {

        // query microcycles with json body
        get.microcycles(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No microcycles found.');
            } else {
                res.status(200).json({
                    message: 'Microcycles retrieved successfully.',
                    microcycles: result
                });
            }

        });

    },

    /**
     * Controller for /api/training/microcycles endpoint.  Saves one microcycle.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        // create microcycle from json body
        post.microcycles(req.body).then((found) => {

            if (found) {
                res.status(409).send('Microcycle already exists.');
            } else {
                // save microcycle to database
                post.microcycles(req.body).then((result) => {

                    if (result) {
                        res.status(201).send('Microcycle saved successfully.');
                    }

                });
            }

        });

    },

    /**
     * Controller for /api/training/microcycles endpoint. Updates one microcycle.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        patch.microcycles(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No microcycle found');
            } else {
                res.status(200).send('Microcycle updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/training/microcycles endpoint. Deletes one microcycle.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        remove.microcycles(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No microcycle found');
            } else {
                res.status(200).send('Microcycle deleted successfully.');
            }

        });

    }

};
