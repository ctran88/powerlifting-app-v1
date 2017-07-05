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
            query = req.query;
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
     * @param      {Object}    req     The request
     * @param      {Object}    res     The response
     * @param      {Function}  next    The next
     */
    post: function(req, res, next) {

        // if active flag is set to true
        if (req.body.metadata.active) {
            var patchPayload = {
                query: req.body.metadata.client,
                update: {
                    active: false
                }
            };

            // set all client's programs' active flags to false
            patch.programsMany(patchPayload).then((result) => {

            }).catch((error) => {

                return next(new Error([error]));

            });
        }

        var payload = req.body;

        // then post new program if no error occured
        post.programs(payload).then((result) => {

            if (result) {
                // if new program active flag is true and is assigned to a client
                if (result.metadata.active && result.metadata.client) {
                    var userPayload = {
                        query: result.metadata.client,
                        update: {
                            _activeProgram: result._id
                        }
                    };

                    // update client's active progarm to this one
                    patch.users(userPayload).then((result) => {

                    }).catch((error) => {

                        return next(new Error([error]));

                    });
                }

                res.status(201).json({
                    message: 'Program saved successfully.',
                    id: result._id
                });
            }

        });

    },

    /**
     * Controller for /api/training/programs endpoint. Updates one program.
     *
     * @param      {Object}  req     The request
     * @param      {Object}  res     The response
     */
    patch: function(req, res) {

        // if active flag is set to true
        if (req.body.metadata.active) {
            var patchPayload = {
                query: req.body.metadata.client,
                update: {
                    active: false
                }
            };

            // set all client's programs' active flags to false
            patch.programsMany(patchPayload).then((result) => {

            }).catch((error) => {

                return next(new Error([error]));

            });
        }

        var payload = {
            query: req.params.id,
            update: req.body
        };

        // then patch program if no error occured
        patch.programs(payload).then((result) => {

            if (!result) {
                res.status(404).send('No program found');
            } else {
                // if program active flag is true and is assigned to a client
                if (result.metadata.active && result.metadata.client) {
                    var userPayload = {
                        query: result.metadata.client,
                        update: {
                            _activeProgram: result._id
                        }
                    };

                    // update client's active progarm to this one
                    patch.users(userPayload).then((result) => {

                    }).catch((error) => {

                        return next(new Error([error]));

                    });
                }

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

        var query = req.params.id;
        
        remove.programs(query).then((result) => {

            if (!result) {
                res.status(404).send('No program found');
            } else {
                var userQuery = {
                    _activeProgram: req.params.id
                };

                get.users(userQuery).then((result) => {

                    for (var i = 0; i < result.length; i++) {
                        var payload = {
                            query: result[i].email,
                            update: {
                                $unset: {
                                    _activeProgram: ''
                                }
                            }
                        };

                        patch.users(payload).then((result) => {

                        }).catch((error) => {

                            return next(new Error([error]));

                        });
                    }

                });
                
                res.status(200).send('Program deleted successfully.');
            }

        });

    }

};
