var express = require('express');
var router = express.Router();
var authController = require('./../app/controllers/auth-controller');
var passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  return res.send('Hello this the api');
});

router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

router.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.json({ msg: 'Hey' + req.user.email });
});


module.exports = router;