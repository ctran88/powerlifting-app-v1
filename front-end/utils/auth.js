'use strict';

import api from './api';
import Router from 'vue-router';
import store from '@/store';

var router = new Router();
const client = 'https://192.168.54.54:8080';

export function signin(email, password) {

    var sanitizedEmail = email.toLowerCase();

    if (sanitizedEmail == '') {
        alert('You must enter an email.');
    } else if (password == '') {
        alert('You must enter a password.');
    } else {
        var payload = {
            email: sanitizedEmail,
            password: password
        };

        api.post('/authentication/sessions', payload)
            .then((response) => {

                if (response.status === 200) {
                    store.dispatch('setUserInfo', response.data.info);
                    router.push('/dash');
                }

            })
            .catch((error) => {

                console.log('Error signing in: ', error);

            });
    }

}

export function signout() {

    api.delete('/authentication/sessions')
        .then((response) => {

            if (response.status === 200) {
                window.location.replace(client);
            }

        })
        .catch((error) => {

            console.log('Error signing out: ', error);

        });

}

export function isSignedIn() {

    return api.get('/authentication/sessions');

}

export async function requireAuth(to, from, next) {

    var response = await isSignedIn();

    if (response.data === 'Not signed in.') {
        next({
            path: '/signin',
            query: {
                redirect: to.fullPath
            }
        });
    } else {
        next();
    }
    
}
