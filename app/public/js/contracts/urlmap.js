goog.provide('exp.urlMap');

goog.require('bad.utils');

exp.urlMap = {
    INDEX: '/',
    AUTO_LOGIN: '/auto_login',
    INTRO: '/intro',
    HEADER: '/header',
    LOGOUT: '/logout',
    LOGIN: '/login',
    LOGIN_HEADER: '/login/header',
    SIGNUP: '/signup',
    HOME: '/home',
    PROFILE: {
        EDIT: '/profile/edit'
    },
    PW: {
        LOST: '/password/lost',
        RESET: '/password/reset',
        EDIT: '/password/edit'
    },
    ACCOUNTS: {
        DELETE: '/accs/delete',
        LIST: '/accs/list'
    }
};