var app = require('../../../app');
var config = require('../../../config/config').config;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var csrf = require('csurf');
var cookieParser = require('cookie-parser');

// trust proxy is needed when using a proxy server
if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
}

// initialize session middleware
app.use(session({

    name:               'sessionId',
    secret:             config.secret,
    saveUninitialized:  false,
    resave:             false,
    store:              new MongoStore({
        url:        config.db,
        touchAfter: 24 * 3600 // 24 hours in seconds
    }),
    cookie: {
        secure:     true,
        httpOnly:   true,
        sameSite:   true
    }

}));

// initialize csrf protection
var csrfProtection = csrf({

    cookie: true

});

// need this because 'cookie' is true in csrfProtection
app.use(cookieParser());
