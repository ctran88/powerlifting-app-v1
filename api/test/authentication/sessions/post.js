'use strict';

describe('POST', function() {

    beforeEach(function(done) {

        var user = new User({
            'email': 'user1@mail.com',
            'firstName': 'first1',
            'lastName': 'last1',
            'accountType': 'coach',
            'password': 'password',
            'memberStart': '2017-05-10T09:25:10.000Z'
        });

        user.save().then(function(doc) {

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

    it ('should set a user session at successful login on POST /api/authentication/sessions', function(done) {
        
        chai.request(server)
            .post('/api/authentication/sessions')
            .send({
                'email': 'user1@mail.com',
                'password': 'password'
            })
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.equal('Login successful.');
                done();
            });

    });

});
