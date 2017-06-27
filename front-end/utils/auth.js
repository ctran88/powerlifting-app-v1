'use strict';

import api from './api';
import store from '@/store';

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

        return api.post('/authentication/sessions', payload)
            .then((response) => {

                if (response.status === 200) {
                    store.dispatch('setUserInfo', response.data.info);
                    return true;
                }

            })
            .catch((error) => {

                console.log('Error signing in: ', error);
                return false;

            });
    }

}

export function signout() {

    return api.delete('/authentication/sessions')
        .then((response) => {

            if (response.status === 200) {
                return true;
            }

        })
        .catch((error) => {

            console.log('Error signing out: ', error);
            return false;

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
        store.dispatch('setUserInfo', response.data.info);
        next();
    }
    
}
