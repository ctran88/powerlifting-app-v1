'use strict';

module.exports = {

    program: function(req, res, next) {

        req.check('metadata').isJSON();
        req.check('metadata.name').notEmpty().isAlphanumeric();
        req.check('metadata.coach').notEmpty().isEmail();
        req.check('metadata.client').isEmail();
        req.check('metadata.status.type').notEmpty().matches('template', 'draft', 'published');
        req.check('metadata.created').isISO8601();
        req.check('metadata.lastUpdated').isISO8601();
        req.check('microcycles').isArrayObjects();

        req.getValidationResult().then((result) => {

            if (!result.isEmpty()) {
                var errors = result.mapped();
                return res.status(400).json(errors);
            } else {
                return next();
            }

        });

    }

};
