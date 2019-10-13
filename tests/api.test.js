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

  describe('Contact', (done) => {
    it('should send a friend request -> 201 Created', (done) => {
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
                .post('/api/contact/confirm')
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

    it('should remove a contact -> 200 OK', (done) => {
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
        const relationship = {
            idToDelete: userCredentials2.id
        };
        user.delete('/api/contact')
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

    // it('should refuse a friend request -> 204 No Content', (done) => {
        
    // });

  });
});
