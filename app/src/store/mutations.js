'use strict';

/**
 * Sets the signed in state.
 *
 * @class      SET_SIGNED_IN (name)
 * @param      {Object}  state   The state
 */
export const SET_SIGNED_IN = (state) => {
  state.signedIn = true;
};

/**
 * Sets the signed out state and resets user state.
 *
 * @class      SET_SIGNED_OUT (name)
 * @param      {Object}  state   The state
 */
export const SET_SIGNED_OUT = (state) => {
  state.signedIn = false;
  state.user = {};
};

/**
 * Sets the user info state.
 *
 * @class      SET_USER_INFO (name)
 * @param      {Object}  state     The state
 * @param      {Object}  userInfo  The user information
 */
export const SET_USER_INFO = (state, userInfo) => {
  state.user = userInfo;
};
