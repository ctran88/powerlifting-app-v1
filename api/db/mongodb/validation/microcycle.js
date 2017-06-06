'use strict';

module.exports = {

    microcycle: function(req, res, next) {

        req.check('metadata').isJSON();
        req.check('metadata.week').notEmpty().isInt();
        req.check('sessions').isArrayObjects();

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
