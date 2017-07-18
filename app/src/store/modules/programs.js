'use strict';

const state = {
  id: ''
};

const getters = {
  /**
   * Gets id state
   *
   * @param      {Object}  state   The state
   * @return     {Object}  The id state
   */
  id: function(state) {
    return state.id;
  }
};

const mutations = {
  /**
   * Sets the program id.
   *
   * @class      SET_PROGRAM_ID (name)
   * @param      {Object}  state      The state
   * @param      {string}  programId  The program identifier
   */
  SET_PROGRAM_ID: function(state, programId) {
    state.id = programId;
  }
};

const actions = {
  /**
   * Action that calls specified mutation
   *
   * @param      {Object}  context  The context
   */
  setProgramId: function(context, programId) {
    context.commit('SET_PROGRAM_ID', programId);
  }
};

const module = {
  state,
  getters,
  mutations,
  actions
};

export default module;
