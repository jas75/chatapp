/* eslint-disable no-undef */
const expect = require('chai').expect;
// var app = require('../bin/www');
const app = require('../app');
const request = require('supertest');
const logger = require('../utils/logger');

describe('Auth Service', (done) => {
  const userCredentials = {
    email: 'test@gmail.com',
    password: 'test'
  };
  // login the user before we run any tests
  const authenticatedUser = request.agent(app);

  before(done => {
    authenticatedUser
      .post('/api/login')
      .send(userCredentials)
      .end((err, response) => {
        if (err) {
          logger.error(err);
        } else {
          jwtToken = response.body.token;
          expect(response.statusCode).to.equal(200);
          done();
        }
      });
  });

  describe('Passport.js', done => {
    it('should return status 200 if the user is logged in', (done) => {
      authenticatedUser.get('/api/special')
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200, done);
    });
  });
});
