'use strict';

var firebase = require('firebase');

// firebase connection config
var config = {
  apiKey: 'AIzaSyAgd-gv9ZL8MgSwnom-JlrmKDt_0XoFGKs',
  authDomain: 'the-powerlifting-notebook.firebaseapp.com',
  databaseURL: 'https://the-powerlifting-notebook.firebaseio.com',
  projectId: 'the-powerlifting-notebook',
  storageBucket: 'the-powerlifting-notebook.appspot.com',
  messagingSenderId: '283385020220'
};

// initialize firebase connection
var firebaseApp = firebase.initializeApp(config);
var firebasedb = firebase.database();

var libraryRef = firebasedb.ref('/library');
var libraryData = {
  liftType: [
    'main',
    'accessories',
    'rest'
  ],
  main: [
    'squat',
    'bench press',
    'deadlift'
  ],
  variations: [
    'low bar',
    'high bar',
    'front',
    'ssb',
    'duffalo',
    'pause',
    '1-ct pause',
    'tempo',
    'pin',
    'tng',
    'close grip',
    'wide grip',
    'board',
    'conventional',
    'sumo',
    'sldl',
    'snatch grip',
    'deficit',
    'block'
  ],
  accessories: [
    'romanian deadlift',
    'hip thrust',
    'overhead press'
  ],
  setsReps: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20'
  ],
  loadType: [
    'rpe',
    '%/1rm',
    '%/ts',
    'weight'
  ]
};

/**
 * Populates firebase database with default data.
 */
function populate() {
  libraryRef.set(libraryData)
    .then(() => process.exit());
}

populate();
