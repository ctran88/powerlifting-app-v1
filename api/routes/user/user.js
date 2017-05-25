'use strict';

module.exports = (req, res) => {

    var user = {
        email: req.body.email,
        password: req.body.password
    };

    var message = 'signup new users here';

    res.status(200).json({

        user

    });

};
