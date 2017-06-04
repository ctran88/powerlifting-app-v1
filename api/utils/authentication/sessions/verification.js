'use strict';

module.exports = {

    verifyCookie: function(req, res, next) {

        req.checkCookies('sessionId', 'Invalid cookie').isAscii();

        req.getValidationResult().then((result) => {

            if (!result.isEmpty()) {
                var errors = result.mapped();
                return res.status(400).json(errors);
            } else if (!req.session.userInfo) {
                return res.status(401).send('Unauthorized to view this page.');
            } else {
                return next();
            }

        });

    }

};
