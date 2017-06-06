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

        user.save().then(function() {

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

    it ('should delete the current user session at successful logout on DELETE /api/authentication/sessions', function(done) {
        
        chai.request(server)
            .delete('/api/authentication/sessions')
            .end(function(err, res) {
                res.should.have.status(200);
                res.text.should.equal('Logout successful.');
                done();
            });

    });

});
