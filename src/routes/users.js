var express = require('express');
var router = express.Router();
var authController = require('./../app/controllers/auth-controller');
var passport = require('passport');


// @route   GET /api
// @des     Home 
// @access  Public
router.get('/', function(req, res, next) {
  return res.send('Hello this the api');
});

// @route   POST /api/user
// @des     Register a user
// @access  Public
router.post('/user', authController.registerUser);

// @route   POST /api/login
// @des     Login user
// @access  Public
router.post('/login', authController.loginUser);


// @route   GET /api/special
// @des     Test the auth
// @access  Auth
router.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({ msg: 'Hey' + req.user.email });
});


module.exports = router;