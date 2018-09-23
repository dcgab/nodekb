const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcryptjs');

module.exports = function(passport) {
  // Local strategy
  passport.use(new LocalStrategy((username, password, done) => {
    // Match username
    let query = {username: username};
    User.findOne(query, (err, user) => {
      if(err) throw err;
      if(!user) {
        return done(null, false, {message: 'Invalid username/password user'})
      }

      // Match password
      bcrypt.compare(password, user.password, (err, success) => {
        if(err) throw err;
        if(success) {
          return done(null, user, {message: 'You are now logged in'});
        } else {
          return done(null, false, {message: 'Invalid username/password password'});
        }
      });
    });
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  });
}