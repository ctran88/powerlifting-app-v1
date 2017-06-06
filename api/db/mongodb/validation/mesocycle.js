'use strict';

module.exports = {

    mesocycle: function(req, res, next) {

        req.check('metadata').isJSON();
        req.check('metadata.name').isAlphanumeric();
        req.check('metadata.cycle').isInt();
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
