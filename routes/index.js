var express = require('express');
var router = express.Router();
let indexController = require('../controllers/indexController')
let accessController = require('../controllers/accessController')

router.get('/favicon.ico', (req,res,next)=>{
    res.sendStatus(204)
});
//Get Login Page
router.get('/', indexController.home);

//Get Login Page
router.get("/login", accessController.loggedIn, indexController.getLogin);

//Post Login 
router.post('/login', accessController.loggedIn, indexController.postLogin)

//Log user out route
router.get('/log-out', indexController.logout)

//Get Sign Up Form
router.get('/sign-Up', accessController.loggedIn, indexController.getSignUp)

//Post sign up 
router.post('/sign-up', accessController.loggedIn, indexController.postSignUp)

//Create Message Get
router.get('/create-message', accessController.isMember, indexController.getCreate)

//Create a new message post 
router.post('/create-message', accessController.isMember, indexController.postCreate)

router.get('/secret', accessController.isUser, indexController.getSecretMember)

router.post('/secret', accessController.isUser, indexController.postSecretMember)

router.get('/secret-admin', accessController.isMember, indexController.getSecretAdmin)

router.post('/secret-admin', accessController.isMember, indexController.postSecretAdmin)

router.get('/delete/:id', accessController.validId, accessController.isAdmin, indexController.getDeleteMsg)

router.post('/delete/:id', accessController.validId, accessController.isAdmin, indexController.postDeleteMsg)

module.exports = router;
