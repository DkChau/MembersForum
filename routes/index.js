var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController')

//Get Login Page
router.get('/', indexController.home);

//Get Login Page
router.get("/login", indexController.getLogin);

//Post Login 
router.post('/login' , indexController.postLogin)

//Log user out route
router.get('/log-out', indexController.logout)

//Get Sign Up Form
router.get('/sign-Up', indexController.getSignUp)

//Post sign up 
router.post('/sign-up', indexController.postSignUp)

module.exports = router;
