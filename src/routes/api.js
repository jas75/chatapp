const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/auth-controller');
const passport = require('passport');

// @route   GET /api
// @des     Home
// @access  Public
router.get('/', (req, res, next) => {
  return res.send('Hello this the api');
});

// @route   POST /api/user
// @des     Register a user
// @access  Public
router.post('/user', authController.registerUser);

// @route   DELETE /api/user
// @des     Delete a user
// @access  Auth
router.delete('/user', passport.authenticate('jwt', { session: false }), authController.deleteUser);

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