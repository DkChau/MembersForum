let Message = require('../models/Message');
let User = require('../models/User');
const { check, validationResult } = require("express-validator");
const passport = require("passport");
const bcrypt = require('bcryptjs');

//Home Middleware that fetches and displays all messages & User if logged in
exports.home = function(req,res,next){
    let Messages = Message.find({}).populate('user').exec();

    Messages.then(allMessage=>{
        if (!allMessage) {
            res.render("home", { messages: [] });
        }
        res.render("home", { messages: allMessage });
        return;
    })
    .catch(err=>{
        next(err);
    })
}

//Login middleware to fetch login form or redirect to home page if logged in
exports.getLogin = function(req,res,next){
    res.render("login", {messages: null});
}

//Login middleware chain to login based on sanitized user input
exports.postLogin = [
    check("username")
        .notEmpty()
        .withMessage("Username required")
        .trim()
        .escape(),

    check("password")
        .notEmpty()
        .withMessage("Password required")
        .trim()
        .escape(),

    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("login", { messages: errors.errors });
        } 
        else {
            passport.authenticate("local", {
            successRedirect: "/",
            failureRedirect: "/login",
            falureFlash: true,
            })(req, res);
        }
    }
]

//Logout middleware and redirect back home
exports.logout = function(req,res,next){
    req.logout();
    res.redirect("/");
}

//Sign Up Middleware to get signup form
exports.getSignUp = function(req,res,next){
    res.render("signUp", {messages: null});
}

//Sign Up Middleware that does validation and encrypts the password before
//Saving the new user
exports.postSignUp = [
    check("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .trim()
    .escape()
    .custom((value, { req }) => {
      return User.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    }),

    check("password")
        .notEmpty()
        .withMessage("Password cannot be empty")
        .trim()
        .escape(),
        
    check("confirmPassword")
        .notEmpty()
        .withMessage("Must confirm password")
        .trim()
        .escape()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        }),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("signUp", { messages: errors.errors });
        } 
        else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if(err){
                    return next(err);
                }
                let user = new User({
                    username: req.body.username,
                    password: hashedPassword,
                });
                user.save(function (err) {
                    if (err) {
                        return next(err);
                    } 
                    else {
                        res.redirect("/login");
                    }
                });
            });
        }
    }
]

//Get create message middleware
exports.getCreate = function (req,res,next){
    res.render('message', {errors:null})
}

//Post Creat message middleware
exports.postCreate = [
    check("title")
      .notEmpty()
      .withMessage("Title cannot be empty")
      .trim()
      .escape(),

    check("text")
      .notEmpty()
      .withMessage("Text cannot be empty")
      .trim()
      .escape(),

    (req, res, next) => {
        console.log(req.user)
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render("message", { errors: errors.errors });
        } 
        else {
            let message = new Message({
                user: req.user._id,
                title: req.body.title,
                message: req.body.text,
            })
            .save(function (err) {
            if (err) {
                return next(err);
            }
            res.redirect("/");
            });
        }
    }
]

//Get become a member page
exports.getSecretMember = function(req,res,next){
    if(req.user && req.user.member){
        res.redirect('/')
    }
    else{
        res.render("secretMember", {message:null});
    }
    
}

//Post secret password to turn account into member
exports.postSecretMember = [
    (req,res,next)=>{
        if(req.user && req.user.member){
            res.redirect('/')
        }
        else{
            next();
        }
    },

    check("secretPassword")
        .trim()
        .escape(),

    (req, res, next) => {
        if(req.body.secretPassword === process.env.SECRET_MEMBER) {
            User.findById(req.user._id).then((user) => {
                user.member = true;
                user.save(function (err) {
                    if (err) {
                    return next(err);
                    }
                    res.redirect("/");
                });
            })
        }
        else {
            res.render("secretMember", { message: "Wrong password" });
        }
    }
]

//Get secret admin page
exports.getSecretAdmin = function(req,res,next){
    if(req.user && req.user.admin){
        res.redirect('/')
    }
    else{
        res.render("secretAdmin", {message:null});
    }
}

//Post secret password to become admin
exports.postSecretAdmin = [
    (req,res,next)=>{
        if(req.user && req.user.admin){
            res.redirect('/')
        }
        else{
            next();
        }
    },

    check("secretPassword").trim().escape(),
    (req, res, next) => {
        if (req.body.secretPassword === process.env.SECRET_ADMIN) {
          User.findById(req.user._id).then((user) => {
            user.admin = true;
            user.save(function (err) {
              if (err) {
                return next(err);
              }
              res.redirect("/");
            });
          });
        } 
        else {
          res.render("secretAdmin", { message: "Wrong password" });
        }
      }
]

//Get delete message middleware
exports.getDeleteMsg = function(req,res,next){
    let deleteMessage = Message.findById(req.params.id)
                        .populate("user")
                        .exec()
    
    deleteMessage.then((message, err) => {
      if (err) {
        return next(err);
      }

      if (!message) {
        res.redirect("/");
      }
      else{
          res.render("delete", { message: message });
      }
    });
}

//Post delete message middleware
exports.postDeleteMsg = function(req,res,next){
    Message.findOneAndDelete({ _id: req.params.id }, (err) => {
        if (err) {
          return next(err);
        }
        else{
            res.redirect("/");
        }
    });    
}