'use strict';

import { firebaseApp } from './firebase';
import store from '@/store/index';

/**
 * Creates an account.
 *
 * @param      {string}  email     The email
 * @param      {string}  password  The password
 * @return     {Promise}  Promise of create account status
 */
export function createAccount(email, password) {
  return firebaseApp.auth().createUserWithEmailAndPassword(email, password);
};

/**
 * Sign in function.  Makes api call to create session information and updates user with last login date.
 *
 * @param      {string}  email     The email
 * @param      {string}  password  The password
 * @return     {Promise}  Promise of sign in status
 */
export function signin(email, password) {
  return firebaseApp.auth().signInWithEmailAndPassword(email, password);
};

/**
 * Sign out function.
 *
 * @return     {Promise}  Promise of signout status
 */
export function signout() {
  return firebaseApp.auth().signOut();
};

/**
 * Checks and sets auth status
 *
 * @return     {Promise}  Promise of user information or null
 */
export function checkSignInStatus(observer) {
  return firebaseApp.auth().onIdTokenChanged(observer);
};

/**
 * Require authorization function.  Checks if signed in to view routes.
 *
 * @param      {Function}  to      The to
 * @param      {Function}  from    The from
 * @param      {Function}  next    The next
 */
export function requireAuth(to, from, next) {
  checkSignInStatus((user) => {
    if (user === null) {
      next({
        path: '/signin',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      next();
    }
  });
};

/**
 * Require coach account type function.  Checks if signed in, then checks if account tyep is coach to view routes.
 *
 * @param      {Function}  to      The to
 * @param      {Function}  from    The from
 * @param      {Function}  next    The next
 */
export async function requireCoach(to, from, next) {
  checkSignInStatus((user) => {
    if (user === null) {
      next({
        path: '/signin',
        query: {
          redirect: to.fullPath
        }
      });
    } else {
      // temporary workaround for page loading on a coach-only page.  Need timeout to wait for user info to update.
      setTimeout(() => {
        if (store.getters.user.accountType !== 'coach') {
          next({
            path: '/dashboard',
            query: {
              redirect: to.fullPath
            }
          });
        } else {
          next();
        }
      }, 500);
    }
  });
};
