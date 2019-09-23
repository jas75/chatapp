var expect = require('chai').expect;
//var app = require('../bin/www');
var app = require('./../app');
var request = require('supertest');

describe('Auth', function(done){

    //let's set up the data we need to pass to the login method
    const userCredentials = {
        email: 'test@gmail.com', 
        password: 'test'
    }
    //now let's login the user before we run any tests
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
//addresses 1st bullet point: if the user is logged in we should get a 200 status code
    it('should return a 200 response if the user is logged in', function(done){
    authenticatedUser.get('/api/special')
    .set('Authorization', 'Bearer ' + jwtToken)
    .expect(200, done);
    });

});
//this test says: make a POST to the /login route with the email: sponge@bob.com, password: garyTheSnail
//after the POST has completed, make sure the status code is 200 
//also make sure that the user has been directed to the /home page