const jwt = require('jsonwebtoken');
const config = require('./../config/config');

module.exports = {
  createToken: function (user) {
    return jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
      expiresIn: 86400
    });
  }
};
