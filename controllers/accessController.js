const mongoose = require("mongoose");

exports.isMember = (req, res, next) => {
  if (req.user) {
    if (req.user.member) {
      next();
    } 
    else {
      res.render("notAllowed", {
        message: "Become a member to access this page",
      });
    }
  } else {
    res.render("notAllowed", {
      message: "Become a member to access this page",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.admin) {
      next();
    } else {
      res.render("notAllowed", {
        message: "Become an admin to access this page",
      });
    }
  } else {
    res.render("notAllowed", {
      message: "Become an admin to access this page",
    });
  }
};

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

exports.loggedIn = (req,res,next)=>{
    if(req.user){
        res.redirect('/')
    }
    else{
        next();
    }
}

exports.validId = (req, res, next) => {
  if (mongoose.Types.ObjectId.isValid(req.params.id)) {
    next();
  } 
  else {
    res.redirect("/");
  }
};
