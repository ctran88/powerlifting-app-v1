'use strict';

var https = require('https');
var fs = require('fs');
var app = require('./app');
var port = process.env.PORT || 3000;

// initialize database connection
app.locals.db.connect();

// initialize secure server connection
var server = https.createServer({

    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')

}, app).listen(port, () => {

    var serverPort = server.address().port;

    console.log('Server is running at port ' + serverPort);

});
