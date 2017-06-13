'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        signedIn: false
    },
    actions,
    mutations,
    getters,
    strict: process.env.NODE_ENV !== 'production'
});

export default store;
