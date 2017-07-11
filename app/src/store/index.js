'use strict';

import Vue from 'vue';
import Vuex from 'vuex';
import * as actions from './actions';
import * as mutations from './mutations';
import * as getters from './getters';
import programsModule from './modules/programs';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    programs: programsModule
  },
  state: {
    signedIn: false,
    user: {}
  },
  actions,
  mutations,
  getters,
  strict: process.env.NODE_ENV !== 'production'
});

export default store;
