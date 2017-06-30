'use strict';

export const setSignedIn = (context) => {
    context.commit('SET_SIGNED_IN');
};

export const setSignedOut = (context) => {
    context.commit('SET_SIGNED_OUT');
};

export const setUserInfo = (context, userInfo) => {
    context.commit('SET_USER_INFO', userInfo);
};

export const setSideNavHiddenOn = (context) => {
    context.commit('SET_SIDE_NAV_HIDDEN_ON');
};

export const setSideNavHiddenOff = (context) => {
    context.commit('SET_SIDE_NAV_HIDDEN_OFF');
};
