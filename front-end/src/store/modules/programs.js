'use strict';

import api from '@/../utils/api';

const state = {
    microcycle: {
        metadata: {},
        sessions: []
    },
    program: {
        metadata: {},
        microcycles: []
    }
};

const getters = {
    microcycle: function(state) {
        return state.microcycle;
    },
    program: function(state) {
        return state.program;
    }
};

const mutations = {
    RESET_MICROCYCLE: function(state) {
        state.microcycle = {
            metadata: {},
            sessions: []
        };
    },
    RESET_PROGRAM: function(state) {
        state.program = {
            metadata: {},
            microcycles: []
        };
    },
    UPDATE_MICROCYCLE: function(state, payload) {
        var session = {
            metadata: {}
        };

        session.metadata.day = payload.metadata.day;
        session.rest = payload.rest;
        session.main = payload.main;
        session.accessories = payload.accessories;

        state.microcycle.metadata.week = payload.metadata.week;
        state.microcycle.sessions.push(session);
    },
    UPDATE_PROGRAM: function(state, name) {
        state.program.metadata.name = name;
        state.program.microcycles.push(state.microcycle);
    }
};

const actions = {
    resetMicrocycle: function(context) {
        context.commit('RESET_MICROCYCLE');
    },
    resetProgram: function(context) {
        context.commit('RESET_PROGRAM');
    },
    updateMicrocycle: function(context, session) {
        context.commit('UPDATE_MICROCYCLE', session);
    },
    updateProgram: function({ commit, dispatch }, name) {
        commit('UPDATE_PROGRAM', name);
        dispatch('resetMicrocycle');
    }
};

const module = {
    state,
    getters,
    mutations,
    actions
};

export default module;