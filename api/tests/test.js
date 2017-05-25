'use strict';

var chai = require('chai');
var expect = chai.expect();
var path = require('path');

var mongoose = require('mongoose');
var User = require(path.join(__dirname, '/../db/', config.database, '/models/user'));

var server = require('../server');


// test suite 1 - /api/user
describe('User endpoint', () => {

    beforeEach((done) => {

        var users = [
            {
                'email': 'user1@mail.com',
                'firstName': 'first1',
                'lastName': 'last1',
                'accountType': 'coach',
                'passwordHash': 'hashedPassword'
            },
            {
                'email': 'user2@mail.com',
                'firstName': 'first2',
                'lastName': 'last2',
                'accountType': 'client',
                'passwordHash': 'hashedPassword'
            },
            {
                'email': 'user3@mail.com',
                'firstName': 'first3',
                'lastName': 'last3',
                'accountType': 'client',
                'passwordHash': 'hashedPassword'
            }
        ];

        User.insertMany(users).then(() => {

            done();

        });

    });

    afterEach((done) => {

        // Drop all collections in test db
        mongoose.connection.db.listCollections().toArray((err, names) => {

            if (err) {
                console.error(err);
            } else {
                names.forEach((value) => {

                    mongoose.connection.db.dropCollection(value.name);

                });

                done();
            }

        });

    });

    it ('should create a new user in the database on /api/user POST', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({
                'email': 'test@mail.com',
                'firstName': 'power',
                'lastName': 'lifter',
                'accountType': 'coach'
            })
            .end((err, res) => {
                res.expect.to.have.status.(201);
                res.expect.to.be.json;
            })
    });
    it ('should read a list of existing users from the database on /api/user GET');
    it ('should read an existing user from the database on /api/user/:id GET');
    it ('should update an existing user from the database on /api/user/:id PATCH');
    it ('should delete an existing user from the database on /api/user/:id DELETE');
});
