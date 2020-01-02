const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
    passport.use(new LocalStrategy(function(username, password, done) {
        User.findOne({username: username}, function(err, user) {
            if(err) {return done(err)};

            //User Not Found
            if(!user) {
                console.log("user not Found");
                return done(null, false, {message: "User Not Found"});
            }
            //User Found But Wrong Password
            bcrypt.compare(password, user.password, function(err, isMatch) {
                if(err) throw err;

                if(isMatch) {
                    console.log("Success loggedIn");
                    return done(null, user, {message: 'Success'});
                }else {
                    console.log("Incorrect password");
                    return done(null, false, {message: 'Incorrect Password'});
                }
            })
        })
    }))

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
    });
    
}