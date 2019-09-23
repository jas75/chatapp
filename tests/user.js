var expect = require('chai').expect;
//var app = require('../bin/www');
var app = require('./../app');
var request = require('supertest');

describe('User Service', function(done){
    
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
        
        //login the user before we run any tests
        var authenticatedUser = request.agent(app);

        it('should return status 204 if user was deleted', done => {
            authenticatedUser
            .post('/api/login')
            .send(userCredentials)
            .end((err, response) => {
                authenticatedUser.delete('/api/user')
                .set('Authorization', 'Bearer ' + response.body.token)
                .expect(204, done);
            }); 
        });
    });
});