'use strict';

import firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyAgd-gv9ZL8MgSwnom-JlrmKDt_0XoFGKs',
  authDomain: 'the-powerlifting-notebook.firebaseapp.com',
  databaseURL: 'https://the-powerlifting-notebook.firebaseio.com',
  projectId: 'the-powerlifting-notebook',
  storageBucket: 'the-powerlifting-notebook.appspot.com',
  messagingSenderId: '283385020220'
};

export const firebaseApp = firebase.initializeApp(config);
export const firebasedb = firebase.database();