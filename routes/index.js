var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController')
let accessController = require('../controllers/accessController')

//Get Login Page
//Regular home page, no restricted access necessary
router.get('/', indexController.home);

//Get Login Page
//Should automatically redirect home if there is already a user logged in
router.get("/login", accessController.loggedIn, indexController.getLogin);
router.post('/login', accessController.loggedIn, indexController.postLogin)

//Log user out route
//Should redirect home no matter logged in or logged out already
router.get('/log-out', indexController.logout)

//Get Sign Up Form
//Should automatically redirect home if there is already a user logged in 
router.get('/sign-up', accessController.loggedIn, indexController.getSignUp)
router.post('/sign-up', accessController.loggedIn, indexController.postSignUp)

//Create Message Get
//Only members should be able to create messages
//Users and guests should be redirected to error page
router.get('/create-message', accessController.isMember, indexController.getCreate)
router.post('/create-message', accessController.isMember, indexController.postCreate)

//Get page to turn Users into Members by entering a secret password
//Only users should be able to enter the password
//Guests should be redirected to error page
//Members and admins should be redirected to home page
router.get('/secret', accessController.isUser, indexController.getSecretMember)
router.post('/secret', accessController.isUser, indexController.postSecretMember)

//Get page to turn Members into Admins by entering a secret password
//Only members should be able to enter the password
//Guests and users should be redirected to error page
//Admins should be redirected to home page 
router.get('/secret-admin', accessController.isMember, indexController.getSecretAdmin)
router.post('/secret-admin', accessController.isMember, indexController.postSecretAdmin)

//Delete a message
//First check if the id parameter is a mongoose id
//If id is incorrect or message doesn't exist then user will be redirected home
//Only admins should be able to delete messages, other users will be redirected to an error page
//Assuming message is found and delete button is clicked, message is deleted.
router.get('/delete/:id', accessController.validId, accessController.isAdmin, indexController.getDeleteMsg)
router.post('/delete/:id', accessController.validId, accessController.isAdmin, indexController.postDeleteMsg)

//A catch all route that returns a 404 view for routes that don't exist
router.get('*', indexController.noRoute);

module.exports = router;
