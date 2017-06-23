'use strict';

module.exports = {

    library: function(req, res, next) {

        req.check('type').isAlpha();
        req.check('list').isArray();

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
