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

export const SET_SIDE_NAV_HIDDEN_ON = (state) => {
    state.sideNavHidden = true;
};

export const SET_SIDE_NAV_HIDDEN_OFF = (state) => {
    state.sideNavHidden = false;
};
