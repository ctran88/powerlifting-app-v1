'use strict';

module.exports = {

    user: function(req, res, next) {

        req.check('email').notEmpty().isEmail();
        req.check('password').notEmpty().isAscii().isLength({
            min: 8,
            max: 20
        });
        req.check('accountType').notEmpty().matches('coach', 'client', 'admin');
        req.check('lastName').isAlpha();
        req.check('firstName').isAlpha();
        req.check('team').isAscii();
        req.check('coach').isEmail();
        req.check('clients').isArray();
        req.check('memberStart').notEmpty().isISO8601();
        req.check('lastLogin').isISO8601();

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
