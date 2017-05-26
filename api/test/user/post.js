'use strict';

describe('POST', function() {

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

    it ('should create a new user in the database on POST /api/user', function(done) {
        
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

});
