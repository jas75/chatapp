var expect = require('chai').expect;
//var app = require('../bin/www');
var app = require('./../app');
var request = require('supertest');

describe('Auth Service', function(done){
    describe('Passport.js', done => {
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
        it('should return status 200 if the user is logged in', function(done){
        authenticatedUser.get('/api/special')
        .set('Authorization', 'Bearer ' + jwtToken)
        .expect(200, done);
        });
    });

    describe('Signup', done => {
        const userCredentials = {
            email: 'signup@gmail.com', 
            password: 'test'
        }
        it('should return status 201 if user registered fine', done => {
            request(app)
            .post('/api/user')
            .send(userCredentials)
            .expect(201, done);
        });
    });

});
