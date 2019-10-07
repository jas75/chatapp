const expect = require('chai').expect;
// var app = require('../bin/www');
const app = require('./../app');
const request = require('supertest');
const logger = require('./../utils/logger');

describe('CRUD', (done) => {
  
    const userCredentials = {
        email: 'test@gmail.com',
        password: 'testt'
    };

    const user = request.agent(app);

    let userId;
    let jwtToken;

    before(done => {
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
    it('should add a new relationship -> 201 Created', (done) => {
        const relationship = {
            user_id_1: userId,
            user_id_2: '5d94791f7859e1131aaf448a'
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

    it('should not create relationship because already exists -> 409 Conflict', (done) => {
        const relationship = {
            user_id_1: userId,
            user_id_2: '5d94791f7859e1131aaf448a'
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
        const relationship = {
            user_id_1: userId,
            user_id_2: '5d94791f7859e1131aaf448a'
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
            user_id_1: userId,
            user_id_2: '5d94791f7859e1131aaf448a'
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
        user.get('/api/contact/jas')
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
    it('should list just one user info -> 200 OK', done => {
        user.get('/api/contact/test')
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
        user.get('/api/contact/tessst')
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
