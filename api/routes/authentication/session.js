'use strict';

module.exports = (req, res) => {

    res.send('<p>' + req.session.id + '</p>');

};
