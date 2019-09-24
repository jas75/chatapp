const User = require('./../models/user');
const jwt = require('jsonwebtoken');
const config = require('./../../config/config');
const logger = require('./../../../utils/logger');

// //TODO create a helper folder
function createToken (user) {
  return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: 86400
  });
}

exports.registerUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: 'You need to send mail and password' });
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    if (user) {
      return res.status(400).json({ msg: 'the user already exists' });
    }

    // TODO always use var and now this ? use a linter bitch
    const newUser = User(req.body);

    newUser.save((err, user) => {
      if (err) {
        if (err.name === 'ValidationError') {
          logger.warn('Wrong email input');
          return res.status(400).json({ msg: 'Wrong email format' });
        }
        logger.error(err);
        return res.status(400).json({ msg: err });
      }

      logger.info('User ' + user.email + ' created');
      return res.status(201).json(user);
    });
  });
};

exports.loginUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    logger.info('Missing payload parameters');
    return res.status(400).json({ msg: 'Email, alias or password not provided' });
  }

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      logger.error(err);
      return res.status(400).json({ msg: err });
    }

    if (!user) {
      logger.warn("Can't find a user");
      return res.status(400).json({ msg: 'the user does not  exists' });
    }

    // method of model User
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (isMatch && !err) {
        logger.info('Token created for ' + user.email);
        // log successful
        return res.status(200).json({
          token: createToken(user),
          userid: user._id
        });
      } else {
        return res.status(400).json({
          msg: 'the email and password don\'t match'
        });
      }
    });
  });
};

exports.deleteUser = (req, res) => {
  // useless ?
  if (!req.user) {
    return res.status(401);
  }

  User.findOneAndDelete({ email: req.user.email }, (err) => {
    if (err) {
      return res.status(400).json({ msg: err });
    }

    logger.info('User ' + req.user.email + ' deleted');
    return res.status(204).json({ msg: 'Your account was deleted :)' });
  });
};
