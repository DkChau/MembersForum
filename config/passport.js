let passport = require("passport");
let LocalStrategy = require("passport-local").Strategy;
let User = require("../models/User");
let bcrypt = require("bcryptjs");

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
