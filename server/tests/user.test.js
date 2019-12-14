// const expect = require('chai').expect
// var app = require('../bin/www');
const app = require('../app');
const request = require('supertest');
const logger = require('../utils/logger');

describe('User Service', (done) => {
  describe('Signup', done => {
    const userCredentials = {
      email: 'signup@gmail.com',
      password: 'test'
    };

    it('should return status 201 Created if user registered fine', done => {
      request(app)
        .post('/api/user')
        .send(userCredentials)
        .expect(201, done);
    });

    // login the user before we run any tests
    const authenticatedUser = request.agent(app);

    it('should return status 204 No Content if user was deleted', done => {
      authenticatedUser
        .post('/api/login')
        .send(userCredentials)
        .end((err, response) => {
          if (err) {
            logger.error(err);
          }
          authenticatedUser.delete('/api/user')
            .set('Authorization', 'Bearer ' + response.body.token)
            .expect(204, done);
        });
    });
  });
});
