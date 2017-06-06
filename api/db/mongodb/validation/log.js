'use strict';

module.exports = {

    log: function(req, res, next) {

        

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
