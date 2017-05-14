'use strict';

var app = require('./app');
var port = process.env.PORT || 3000;

// initialize database connection
app.locals.db.connect();

// initialize server connection
app.listen(port, () => {

    console.log('Server is running on port ' + port);

});
