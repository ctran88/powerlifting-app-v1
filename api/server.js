'use strict';

var https = require('https');
var fs = require('fs');
var app = require('./app');
var config = require('./config/config').config;
var port = config.port;

// initialize database connection
app.locals.db.connect();
console.log(__dirname)
// initialize secure server connection
var server = https.createServer({

    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')

}, app).listen(port, () => {

    if (process.env.NODE_ENV !== 'test') {
        var serverPort = server.address().port;
        console.log('Server is running at port ' + serverPort);
    }

});

module.exports = server;
