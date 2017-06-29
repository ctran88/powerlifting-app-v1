'use strict';

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
    UPDATE_PROGRAM: function(state, metadata) {
        state.program.metadata = metadata;
        state.program.microcycles.push(state.microcycle);
    },
    SET_PROGRAM_ID: function(state, programId) {
        state.program._id = programId;
    },
    SET_PROGRAM: function(state, program) {
        state.program.metadata = program.metadata;
        state.program.microcycles = program.microcycles;
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
    updateProgram: function(context, metadata) {
        context.commit('UPDATE_PROGRAM', metadata);
        context.dispatch('resetMicrocycle');
    },
    setProgramId: function(context, programId) {
        context.commit('SET_PROGRAM_ID', programId);
    },
    setProgram: function(context, program) {
        context.commit('SET_PROGRAM', program);
    }
};

const module = {
    state,
    getters,
    mutations,
    actions
};

export default module;
