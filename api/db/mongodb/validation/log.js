'use strict';

module.exports = {

    log: function(req, res, next) {

        req.check('metadata.date').isISO8601();

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
