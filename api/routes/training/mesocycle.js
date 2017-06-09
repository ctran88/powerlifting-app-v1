'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/training/mesocycles endpoint.  Queries one, many, or all mesocycles.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {

        // query mesocycles with json body
        get.mesocycles(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No mesocycles found.');
            } else {
                res.status(200).json({
                    message: 'Mesocycles retrieved successfully.',
                    mesocycles: result
                });
            }

        });

    },

    /**
     * Controller for /api/training/mesocycles endpoint.  Saves one mesocycle.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        // create mesocycle from json body
        post.mesocycles(req.body).then((found) => {

            if (found) {
                res.status(409).send('Mesocycle already exists.');
            } else {
                // save mesocycle to database
                post.mesocycles(req.body).then((result) => {

                    if (result) {
                        res.status(201).send('Mesocycle saved successfully.');
                    }

                });
            }

        });

    },

    /**
     * Controller for /api/training/mesocycles endpoint. Updates one mesocycle.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        patch.mesocycles(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No mesocycle found');
            } else {
                res.status(200).send('Mesocycle updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/training/mesocycles endpoint. Deletes one mesocycle.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        remove.mesocycles(req.body).then((result) => {

            if (!result) {
                res.status(404).send('No mesocycle found');
            } else {
                res.status(200).send('Mesocycle deleted successfully.');
            }

        });

    }

};
