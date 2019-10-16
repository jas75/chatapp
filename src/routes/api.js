const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/auth-controller');
const contactController = require('../app/controllers/contact-controller');
const passport = require('passport');

// @route   GET /api
// @des     Home
// @access  Public
router.get('/', (req, res, next) => {
  return res.send('Hello this the api');
});

// @route   GET /api/special
// @des     Test the auth
// @access  Auth
router.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({ msg: 'Hey' + req.user.email });
});

// @route   GET /api/user
// @des     Get current user
// @access  Auth

// @route   POST /api/user
// @des     Register a user
// @access  Public
router.post('/user', authController.registerUser);

// @route   DELETE /api/user
// @des     Delete a user
// @access  Auth
router.delete('/user', passport.authenticate('jwt', { session: false }), authController.deleteUser);


// @route   GET /api/user/:email
// @des     Returns an array of one or several users suggestions
// @access  Auth
router.get('/user/:email', passport.authenticate('jwt', { session: false }), contactController.getOneOrManyUsers);

// @route   POST /api/login
// @des     Login user
// @access  Public
router.post('/login', authController.loginUser);


// @route   GET /api/contact/:id
// @des     Get relationships by given id and current user id
// @access  Auth
router.get('/contact/:id', passport.authenticate('jwt', { session: false }), contactController.getRelationshipByIds);


// @route   POST /api/contact
// @des     Send a friend request
// @access  Auth
router.post('/contact', passport.authenticate('jwt', { session: false }), contactController.sendFriendRequest);

// @route   DELETE /api/contact
// @des     Remove friendship
// @access  Auth
router.delete('/contact', passport.authenticate('jwt', { session: false }), contactController.removeContact);

// @route   POST /api/contact/confirm
// @des     Accept friend request
// @access  Auth
router.post('/contact/confirm', passport.authenticate('jwt', { session: false }), contactController.acceptFriend);


module.exports = router;
