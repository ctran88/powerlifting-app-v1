'use strict';

export const SET_SIGNED_IN = (state) => {
    state.signedIn = true;
};

export const SET_SIGNED_OUT = (state) => {
    state.signedIn = false;
};
