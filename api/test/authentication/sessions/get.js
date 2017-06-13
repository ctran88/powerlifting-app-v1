'use strict';

describe('GET', function() {

    var agent = chai.request.agent(server);

    beforeEach(function(done) {

        var user = new User({
            'email': 'user1@mail.com',
            'firstName': 'first1',
            'lastName': 'last1',
            'accountType': 'coach',
            'password': 'password',
            'memberStart': '2017-05-10T09:25:10.000Z',
        });

        user.save().then(function() {

            agent
                .post('/api/authentication/sessions')
                .send({
                    'email': 'user1@mail.com',
                    'password': 'password'
                })
                .end(function(err, res) {

                    done();

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

    it ('should retrieve the current session status on GET /api/authentication/sessions', function(done) {
        
        agent
            .get('/api/authentication/sessions')
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.equal('Signed in.');
                done();
            });

    });

});
