'use strict';

var common = require('../common');
var server = common.server;
var chai = common.chai;
var should = common.should;
var mongoose = common.mongoose;
var User = common.user;

describe('/api/user', function() {

    beforeEach(function(done) {

        var users = [
            {
                'email': 'user1@mail.com',
                'firstName': 'first1',
                'lastName': 'last1',
                'accountType': 'coach',
                'password': 'hashedPassword'
            },
            {
                'email': 'user2@mail.com',
                'firstName': 'first2',
                'lastName': 'last2',
                'accountType': 'client',
                'password': 'hashedPassword'
            },
            {
                'email': 'user3@mail.com',
                'firstName': 'first3',
                'lastName': 'last3',
                'accountType': 'client',
                'password': 'hashedPassword'
            }
        ];

        User.insertMany(users).then(function() {

            done();

        });

    });

    afterEach(function(done) {

        // Drop all collections in test db
        mongoose.connection.db.listCollections().toArray(function(err, names) {

            if (err) {
                console.error(err);
            } else {
                names.forEach(function(value) {

                    mongoose.connection.db.dropCollection(value.name);

                });

                done();
            }

        });

    });

    it ('should create a new user in the database on /api/user POST', function(done) {
        
        chai.request(server)
            .post('/api/user')
            .send({
                'email': 'test@mail.com',
                'password': 'plaintextpassword',
                'firstName': 'power',
                'lastName': 'lifter',
                'accountType': 'coach'
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.message.should.equal('User saved successfully.');
                done();
            });

    });

    it ('should read a list of existing users from the database on /api/user GET', function(done) {
        
        chai.request(server)
            .get('/api/user')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.equal('Users retrieved successfully.');
                res.body.users.should.be.a('array');
                res.body.users[0].should.have.property('email');
                res.body.users[0].email.should.not.equal(null);
                res.body.users[0].should.have.property('firstName');
                res.body.users[0].should.have.property('lastName');
                res.body.users[0].should.have.property('accountType');
                res.body.users[0].accountType.should.not.equal(null);
                res.body.users.should.have.lengthOf(3);
                done();
            });

    });

    it ('should read an existing user from the database on /api/user/:email GET', function(done) {
        
        User.findOne().then(function(doc) {

            var email = doc.email.replace('@', '%40');

            chai.request(server)
                .get('/api/user/' + email)
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.message.should.equal('User retrieved successfully.');
                    res.body.user.should.be.a('array');
                    res.body.user[0].should.have.property('email');
                    res.body.user[0].email.should.not.equal(null);
                    res.body.user[0].should.have.property('firstName');
                    res.body.user[0].should.have.property('lastName');
                    res.body.user[0].should.have.property('accountType');
                    res.body.user[0].accountType.should.not.equal(null);
                    res.body.user.should.have.lengthOf(1);
                    done();
                });

        });

    });

    it ('should update an existing user from the database on /api/user/:email PATCH', function(done) {
        
        User.findOne().then(function(doc) {

            var email = doc.email.replace('@', '%40');

            chai.request(server)
                .patch('/api/user/' + email)
                .send({
                    'team': 'team name',
                    'firstName': 'new first name'
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.message.should.equal('User updated successfully.');
                    res.body.user.should.be.a('object');
                    res.body.user.should.have.property('email');
                    res.body.user.email.should.not.equal(null);
                    res.body.user.should.have.property('firstName');
                    res.body.user.should.have.property('lastName');
                    res.body.user.should.have.property('accountType');
                    res.body.user.accountType.should.not.equal(null);
                    done();
                });
                
        });

    });

    it ('should delete an existing user from the database on /api/user/:email DELETE', function(done) {
        
        chai.request(server)

    });
});
