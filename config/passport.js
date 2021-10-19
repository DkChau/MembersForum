let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let User = require("../models/User");
let bcrypt = require("bcryptjs");

//Configuration of passport strategy
//Username is obtained from the form and used to search database
//If user exists, then compare entered password to database password
//If all works well, return user using done function
//If there is an error pass  back false in place of user and flash error messages
let strategy = new LocalStrategy(
  { passReqToCallback: true },
  (req, username, password, done) => {
    User.findOne({ username: username }).then((user) => {
      if (!user) {
        return done(
          null,
          false,
          req.flash("loginMessage", "User does not exist")
        );
      }
      bcrypt.compare(password, user.password, (err, response) => {
        if (err) {
          return next(err);
        }
        if (response) {
          return done(null, user);
        } else {
          return done(null, false, req.flash("loginMessage", "Wrong password"));
        }
      });
    });
  }
);

passport.use(strategy);
