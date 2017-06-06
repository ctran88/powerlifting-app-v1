'use strict';

describe('GET', function() {

    var agent = chai.request.agent(server);

    beforeEach(function(done) {

        var users = [
            {
                'email': 'user1@mail.com',
                'firstName': 'first1',
                'lastName': 'last1',
                'accountType': 'coach',
                'password': 'password',
                'memberStart': '2017-05-10T09:25:10.000Z',
                'clients': [
                    'user2@mail.com',
                    'user3@mail.com'
                ]
            },
            {
                'email': 'user2@mail.com',
                'firstName': 'first2',
                'lastName': 'last2',
                'accountType': 'client',
                'password': 'password',
                'memberStart': '2017-05-10T09:25:10.000Z',
                'coach': 'user1@mail.com'
            },
            {
                'email': 'user3@mail.com',
                'firstName': 'first3',
                'lastName': 'last3',
                'accountType': 'client',
                'password': 'password',
                'memberStart': '2017-05-10T09:25:10.000Z',
                'coach': 'user1@mail.com'
            }
        ];
        var usersSaved = 0;

        users.forEach(function(current, index, array) {

            var user = new User(current);
            user.save().then(function() {

                usersSaved++;
                if (usersSaved == array.length) {
                    agent
                        .post('/api/authentication/sessions')
                        .send({
                            'email': 'user1@mail.com',
                            'password': 'password'
                        })
                        .end(function(err, res) {

                            done();

                        });
                }

            });

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

                agent
                    .delete('/api/authentication/sessions')
                    .end(function(err, res) {

                        done();

                    });
            }

        });

    });

    it ('should read a list of existing users from the database on GET /api/users', function(done) {
        
        agent
            .get('/api/users')
            .send({
                'coach': 'user1@mail.com'
            })
            .end(function(err, res) {

                res.should.have.status(200);
                res.should.be.json;
                res.body.message.should.equal('Users retrieved successfully.');
                res.body.users.should.be.a('array');
                res.body.users[0].should.have.property('email');
                res.body.users[0].email.should.not.equal(null);
                res.body.users[0].should.have.property('accountType');
                res.body.users[0].accountType.should.equal('client');
                res.body.users[0].should.have.property('coach');
                res.body.users[0].coach.should.equal('user1@mail.com');
                res.body.users.should.have.lengthOf(2);
                done();

            });

    });

    it ('should read an existing user from the database on GET /api/users/:email', function(done) {
        
        User.findOne().then(function(doc) {

            var formattedEmail = doc.email.replace('@', '%40');

            agent
                .get('/api/users/' + formattedEmail)
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

});
