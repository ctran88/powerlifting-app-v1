'use strict';

/**
 * Action that calls specified mutation
 *
 * @param      {Object}  context  The context
 */
export const setSignedIn = (context) => {

    context.commit('SET_SIGNED_IN');

};

/**
 * Action that calls specified mutation
 *
 * @param      {Object}  context  The context
 */
export const setSignedOut = (context) => {

    context.commit('SET_SIGNED_OUT');

};

/**
 * Action that calls specified mutation
 *
 * @param      {Object}  context   The context
 * @param      {Object}  userInfo  The user information
 */
export const setUserInfo = (context, userInfo) => {

    context.commit('SET_USER_INFO', userInfo);

};

/**
 * Action that calls specified mutation
 *
 * @param      {Object}  context  The context
 */
export const setSideNavHiddenOn = (context) => {

    context.commit('SET_SIDE_NAV_HIDDEN_ON');

};

/**
 * Action that calls specified mutation
 *
 * @param      {Object}  context  The context
 */
export const setSideNavHiddenOff = (context) => {

    context.commit('SET_SIDE_NAV_HIDDEN_OFF');

};
