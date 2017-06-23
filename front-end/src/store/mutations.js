'use strict';

export const SET_SIGNED_IN = (state) => {
    state.signedIn = true;
};

export const SET_SIGNED_OUT = (state) => {
    state.signedIn = false;
    state.user = {};
};

export const SET_USER_INFO = (state, userInfo) => {
    state.user = userInfo;
}

export const API_FAILURE = (state, error) => {
    state.apiError = error;
    console.log('API error: ', error);
};
