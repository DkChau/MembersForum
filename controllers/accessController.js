const mongoose = require("mongoose");

//Middleware to make sure that member only routes can only be accessed by members
exports.isMember = (req, res, next) => {
  if (req.user && req.user.member) {
    next();
  } 
  else {
    res.render("notAllowed", {
      message: "Become a member to access this page",
    });
  }
};

//Middleware to ensure that only admins can access admin-only routes such as delete
exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } 
  else {
    res.render("notAllowed", {
      message: "Become an admin to access this page",
    });
  }
};

//Middleware to ensure that only users can access user only routes.
exports.isUser = (req, res, next) => {
  if (req.user) {
    next();
  } 
  else {
    res.render("notAllowed", {
      message: "Create an account to access this page",
    });
  }
};

//Middleware to redirect users and prevent potential issues such as double logging in, etc.
exports.loggedIn = (req,res,next)=>{
    if(req.user){
        res.redirect('/')
    }
    else{
        next();
    }
}

//Middleware to ensure that delete post and get requests only apply to valid mongoose documents
//Otherwise redirect back home
exports.validId = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    next();
  } 
  else {
    res.redirect("/");
  }
};
