var passport = require('passport');
var BearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jsonwebtoken');
var User = require('./models/userModel');

passport.use(new BearerStrategy(
    function (token, done) { 
        jwt.verify(token, 'SECRET', (err, decoded) => {
            if (err) {
                return done(err);
            }
            else {
                var userId = decoded._id;
                User.findById(userId, function (err, user) {
                    if (err) { return done(err); }
                    if (!user) {
                        return done(null, false);
                    }
                    return done(null, true);
                });
            }
        });
    }
));

module.exports = passport;