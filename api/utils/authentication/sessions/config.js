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
    saveUninitialized:  true,
    resave:             false,
    store:              new MongoStore({
        url:        config.db,
        touchAfter: 24 * 60 * 60, // 24 hours in seconds
        ttl:        1 * 60 * 60 // 1 hour in seconds
    }),
    cookie: {
        secure:     true,
        httpOnly:   true,
        sameSite:   true,
        maxAge:     30 * 60 * 1000 // 30 minutes in milliseconds
    }

}));

// signin method to associate user information with session
session.Session.prototype.signin = function(user, cb) {

    const req = this.req;

    req.session.regenerate((err) => {
        
        if (err) {
            cb(err);
        }

        req.session.userInfo = user;
        cb();

    });

};

// initialize csrf protection
var csrfProtection = csrf({

    cookie: true

});

// need this because 'cookie' is true in csrfProtection
app.use(cookieParser());
