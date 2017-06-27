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
