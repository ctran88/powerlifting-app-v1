'use strict';

var axios = require('axios');

axios.defaults.withCredentials = true;

const api = 'https://192.168.54.54:3000/api/';
const client = 'https://192.168.54.54:8080';

module.exports = {

    signin: function(email, password) {

        var sanitizedEmail = email.toLowerCase();

        if (sanitizedEmail == '') {
            alert('You must enter an email.');
        } else if (password == '') {
            alert('You must enter a password.');
        } else {
            axios.post(api + 'authentication/sessions', {
                email: sanitizedEmail,
                password: password
            })
            .then((res) => {

                if (res.status === 200) {
                    window.location.hash = 'dash';
                }

            })
            .catch((err) => {
                alert('Invalid email and/or password. ', err);

            });
        }

    },

    signout: function() {

        axios.delete(api + 'authentication/sessions')
        .then((res) => {

            if (res.status === 200) {
                window.location.replace(client);
            }

        })
        .catch((err) => {
            alert('Error signing out: ', err);
        });

    },

    isSignedIn: function() {

        return axios.get(api + 'authentication/sessions');

    },

    requireAuth: async function(to, from, next) {

        var response = await module.exports.isSignedIn();

        if (response.data === 'Signed in.') {
            next();
        } else {
            next({
                path: '/signin',
                query: {
                    redirect: to.fullPath
                }
            });
        }
        
    }

};
