const expect = require('chai').expect;
// var app = require('../bin/www');
const app = require('./../app');
const request = require('supertest');
const logger = require('./../utils/logger');

describe('CRUD', (done) => {
  
    const userCredentials = {
        email: 'test1@gmail.com',
        password: 'test1'
    };

    const userCredentials2 = {
        email: 'test2@gmail.com',
        password: 'test2',
        id: '5d9cd2200c1b5d249920b1d6'
    };

    const user = request.agent(app);

    let userId;
    let jwtToken;

    before((done) => { 
        user
        .post('/api/login')
        .send(userCredentials)
        .end((err, response) => {
        if (err) {
            logger.error(err);
        } else {
            userId = response.body.user._id;
            jwtToken = response.body.token;
            expect(response.statusCode).to.equal(200);
            done();
        }
        });
    });

  describe('Relationships', (done) => {
    it('should send a freind request -> 201 Created', (done) => {
        const relationship = {
            sender: userId,
            recipient: userCredentials2.id
        };
        user.post('/api/contact')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(relationship)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(201);
                done();
            }
        });
    });

    it('should not send friend request because already exists -> 409 Conflict', (done) => {
        const relationship = {
            sender: userId,
            recipient: userCredentials2.id
        };

        user.post('/api/contact')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(relationship)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(409);
                done();
            }
        });
    });

    it('should remove a relationship -> 200 OK', (done) => {
        // tester avec des id qui existe et qui existent pas
        // TODO faire evoluer ce code
        const relationship = {
            idToDelete: userCredentials2.id
        };
        user.delete('/api/contact')
        .send(relationship)
        .set('Authorization', 'Bearer ' + jwtToken)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(200);
                done();
            }
        });
    });

    it('should not remove anything because relationship does\'nt exist -> 400 Bad Request', (done) => {
        //test ca plus seieusement pas juste le status !!
        const relationship = {
            sender: userId,
            recipient: userCredentials2.id
        };
        user.delete('/api/contact')
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(relationship)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(400);
                done();
            }
        });
    });

    // Has to have at least two documents in db
    it('should list several users info -> 200 OK', done => {
        user.get('/api/user/test')
        .set('Authorization', 'Bearer ' + jwtToken)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(200);
                expect(response.body.users).to.have.lengthOf(3);
                done();
            }
        });
    });


    // must have only one document name test in db
    it('should list just one user info -> 200 OK', done => {
        user.get('/api/user/test1')
        .set('Authorization', 'Bearer ' + jwtToken)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(200);
                expect(response.body.users).to.have.lengthOf(1);
                done();
            }
        });
    });

    it('should return nothing -> 204 No Content', done => {
        user.get('/api/user/tessst')
        .set('Authorization', 'Bearer ' + jwtToken)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(204);
                expect(response.body.users).to.equal(undefined);
                done();
            }
        });
    });
  });
});
