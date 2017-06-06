'use strict';

describe('POST', function() {

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

    it ('should create a new user in the database on POST /api/users', function(done) {
        
        chai.request(server)
            .post('/api/users')
            .send({
                'email': 'test@mail.com',
                'password': 'password',
                'firstName': 'power',
                'lastName': 'lifter',
                'accountType': 'coach',
                'memberStart': '2017-05-10T09:25:10.000Z' 
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.text.should.equal('User saved successfully.');
                done();
            });

    });

});
