var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
let passport = require("passport");
let session = require("express-session");
let User = require("./models/User");
const flash = require("connect-flash");

var indexRouter = require('./routes/index');

//Require environment variables
require("dotenv").config();

//Establish Mongodb connection
const mongoDb = process.env.MONGODB_URI;
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

//Create express app
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUnitialized: true,
  })
);

app.use(flash());

app.use(function (req, res, next) {
  res.locals.error_messages = req.flash("loginMessage");
  next();
});

require("./config/passport");

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

//Middleware to ensure that user object is available for view usage
app.use((req, res, next) => {
  if(req.isAuthenticated()){
    res.locals.currentUser = req.user;
  }
  else{
    res.locals.currentUser = null;
  }
  next();
});

//Loading router and controller middleware
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
