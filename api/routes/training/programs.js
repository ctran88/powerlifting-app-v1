'use strict';

var config = require('../../config/config').config;
var path = require('path');
var get = require(path.join(__dirname, '/../../db/', config.database, '/services/get'));
var post = require(path.join(__dirname, '/../../db/', config.database, '/services/post'));
var patch = require(path.join(__dirname, '/../../db/', config.database, '/services/patch'));
var remove = require(path.join(__dirname, '/../../db/', config.database, '/services/delete'));

module.exports = {

    /**
     * Controller for /api/training/programs endpoint.  Queries one, many, or all programs.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    get: function(req, res) {

        var query = {};

        // if req.query object is not empty
        if (Object.keys(req.query).length !== 0) {
            query = {
                'metadata.coach': req.query.coach
            };
        }

        // query programs with json body
        get.programs(query).then((result) => {

            if (!result) {
                res.status(404).send('No programs found.');
            } else {
                res.status(200).json({
                    message: 'Programs retrieved successfully.',
                    programs: result
                });
            }

        });

    },

    /**
     * Controller for /api/training/programs endpoint.  Saves one program.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    post: function(req, res) {

        var query = {
            'metadata.name': req.body.metadata.name,
            'metadata.coach': req.body.metadata.coach,
            'metadata.created': req.body.metadata.created
        };

        // query programs with json body
        get.programs(query).then((found) => {

            if (found) {
                res.status(409).send('Program already exists.');
            } else {
                // create program from json body
                post.programs(req.body).then((result) => {

                    if (result) {
                        res.status(201).send('Program saved successfully.');
                    }

                });
            }
        })

    },

    /**
     * Controller for /api/training/programs endpoint. Updates one program.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        patch.programs(req.params.id, req.body).then((result) => {

            if (!result) {
                res.status(404).send('No program found');
            } else {
                res.status(200).send('Program updated successfully.');
            }

        });
        
    },

    /**
     * Controller for /api/training/programs endpoint. Deletes one program.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    delete: function(req, res) {
        
        remove.programs(req.params.id, req.body).then((result) => {

            if (!result) {
                res.status(404).send('No program found');
            } else {
                res.status(200).send('Program deleted successfully.');
            }

        });

    }

};
