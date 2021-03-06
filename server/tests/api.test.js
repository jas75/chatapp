const expect = require('chai').expect;
// var app = require('../bin/www');
const app = require('../app');
const request = require('supertest');
const logger = require('../utils/logger');

describe('API', (done) => {
  
    const userCredentials = {
        email: 'test1@gmail.com',
        password: 'test1',
        id: '5d9cd2150c1b5d249920b1d5'
    };

    const userCredentials2 = {
        email: 'test2@gmail.com',
        password: 'test2',
        id: '5d9cd2200c1b5d249920b1d6'
    };

    const user = request.agent(app);

    let userId;
    let jwtToken;

    beforeEach((done) => { 
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


    describe('Users', (done) => {

        it('should list test2 infos -> 200 OK', (done) => {
            user.get('/api/user/5d9cd2200c1b5d249920b1d6')
            .set('Authorization', 'Bearer ' + jwtToken)
            .end((err, response) => {
                if (err) {
                    logger.error(err);
                } else {
                    expect(response.body).to.exist;
                    expect(response.status).to.equal(200);
                    done();
                }
            });
        });

        // Has to have at least two documents in db
        it('should list 2 users -> 200 OK', done => {
            user.get('/api/user/suggestions/test')
            .set('Authorization', 'Bearer ' + jwtToken)
            .end((err, response) => {
                if (err) {
                    logger.error(err);
                } else {
                    expect(response.status).to.equal(200);
                    expect(response.body.users).to.have.lengthOf(2);
                    done();
                }
            });
        });


        // must have only one document name test in db
        it('should list just one user -> 200 OK', done => {
            user.get('/api/user/suggestions/test2')
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
            user.get('/api/user/suggestions/tessst')
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

  describe('Contact', (done) => {
    it('test1 should send a friend request to test2 -> 201 Created', (done) => {
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

    it('should list test1 relationships -> 200 OK', (done) => {
        user.get('/api/contact')
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

    it('should not send friend request because already sent or existing -> 409 Conflict', (done) => {
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

    it('should accept a friend request -> 201 Created', (done) => {
        user
        .post('/api/login')
        .send(userCredentials2)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                userId = response.body.user._id;
                jwtToken = response.body.token;
                
                const sender = {
                    sender: userCredentials.id
                };
                
                user
                .post('/api/friend-request/confirm')
                .set('Authorization', 'Bearer ' + jwtToken)
                .send(sender)
                .end((err, response) => {
                    if (err) {
                        logger.error(err);
                    } else {
                        expect(response.status).to.equal(201);
                        expect(response).to.exist;
                        done();
                    }
                });
            }
        });     
    });

    it('should deny a friend request and delete the Relationship -> 200 OK', (done) => {
        const relationship = {
            sender_id: userCredentials2.id
        };
        user.delete(`/api/friend-request/deny/${relationship.sender_id}`)
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
        const relationship = {
            sender_id: userCredentials2.id
        };
        user.delete(`/api/friend-request/deny/${relationship.sender_id}`)
        .set('Authorization', 'Bearer ' + jwtToken)
        .send(relationship)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.body.msg).to.equal('Relationship does not exist');
                expect(response.status).to.equal(400);
                done();
            }
        });
    });

    it('should return nothing -> 204 No Content', (done) => {
        user.get('/api/contact/' + userCredentials2.id)
        .set('Authorization', 'Bearer ' + jwtToken)
        .end((err, response) => {
            if (err) {
                logger.error(err);
            } else {
                expect(response.status).to.equal(204);
                done();
            }
        });
    });
  });
});
