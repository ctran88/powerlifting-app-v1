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
    /**
     * Gets microcycle state
     *
     * @param      {Object}  state   The state
     * @return     {Object}  The microcycle state
     */
    microcycle: function(state) {

        return state.microcycle;

    },

    /**
     * Gets program state
     *
     * @param      {Object}  state   The state
     * @return     {Object}  The program state
     */
    program: function(state) {

        return state.program;

    }
};

const mutations = {
    /**
     * Resets microcycle state
     *
     * @class      RESET_MICROCYCLE (name)
     * @param      {Object}  state   The state
     */
    RESET_MICROCYCLE: function(state) {

        state.microcycle = {
            metadata: {},
            sessions: []
        };

    },

    /**
     * Resets program state
     *
     * @class      RESET_PROGRAM (name)
     * @param      {Object}  state   The state
     */
    RESET_PROGRAM: function(state) {

        state.program = {
            metadata: {},
            microcycles: []
        };

    },

    /**
     * Updates microcycle state
     *
     * @class      UPDATE_MICROCYCLE (name)
     * @param      {Object}  state    The state
     * @param      {Object}  payload  The payload
     */
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

    /**
     * Updates program state
     *
     * @class      UPDATE_PROGRAM (name)
     * @param      {Object}  state     The state
     * @param      {Object}  metadata  The metadata
     */
    UPDATE_PROGRAM: function(state, metadata) {

        state.program.metadata = metadata;
        state.program.microcycles.push(state.microcycle);

    },

    /**
     * Sets the program id.
     *
     * @class      SET_PROGRAM_ID (name)
     * @param      {Object}  state      The state
     * @param      {string}  programId  The program identifier
     */
    SET_PROGRAM_ID: function(state, programId) {

        state.program._id = programId;

    },

    /**
     * Sets the program data.
     *
     * @class      SET_PROGRAM (name)
     * @param      {Object}  state    The state
     * @param      {Object}  program  The program
     */
    SET_PROGRAM: function(state, program) {

        state.program.metadata = program.metadata;
        state.program.microcycles = program.microcycles;

    }
};

const actions = {
    /**
     * Action that calls specified mutation
     *
     * @param      {Object}  context  The context
     */
    resetMicrocycle: function(context) {

        context.commit('RESET_MICROCYCLE');

    },

    /**
     * Action that calls specified mutation
     *
     * @param      {Object}  context  The context
     */
    resetProgram: function(context) {

        context.commit('RESET_PROGRAM');

    },

    /**
     * Action that calls specified mutation
     *
     * @param      {Object}  context  The context
     */
    updateMicrocycle: function(context, session) {

        context.commit('UPDATE_MICROCYCLE', session);

    },

    /**
     * Action that calls specified mutations
     *
     * @param      {Object}  context  The context
     */
    updateProgram: function(context, metadata) {

        context.commit('UPDATE_PROGRAM', metadata);
        context.dispatch('resetMicrocycle');
        
    },

    /**
     * Action that calls specified mutation
     *
     * @param      {Object}  context  The context
     */
    setProgramId: function(context, programId) {

        context.commit('SET_PROGRAM_ID', programId);

    },

    /**
     * Action that calls specified mutation
     *
     * @param      {Object}  context  The context
     */
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
