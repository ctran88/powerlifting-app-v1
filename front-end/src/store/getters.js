'use strict';

/**
 * Returns signedIn state
 *
 * @param      {Object}  state   The state
 * @return     {boolean}  Signed in state
 */
export const signedIn = (state) => {

    return state.signedIn;

};

/**
 * Returns userInfo state
 *
 * @param      {Object}  state   The state
 * @return     {Object}  User state
 */
export const userInfo = (state) => {

    return state.user;

};

/**
 * Returns sideNavHidden state
 *
 * @param      {Object}  state   The state
 * @return     {boolean}  SideNavHidden state
 */
export const sideNavHidden = (state) => {

    return state.sideNavHidden;

};
