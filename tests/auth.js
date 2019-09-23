var expect = require('chai').expect;
//var app = require('../bin/www');
var app = require('./../app');
var request = require('supertest');

describe('Auth', function(done){

    const userCredentials = {
        email: 'test@gmail.com', 
        password: 'test'
    }
    //login the user before we run any tests
    var authenticatedUser = request.agent(app);
    before(done => {
        authenticatedUser
        .post('/api/login')
        .send(userCredentials)
        .end((err, response) => {
            jwtToken = response.body.token
            expect(response.statusCode).to.equal(200);
            done();
        });
    });
    it('should return a 200 response if the user is logged in', function(done){
    authenticatedUser.get('/api/special')
    .set('Authorization', 'Bearer ' + jwtToken)
    .expect(200, done);
    });

});
