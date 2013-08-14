goog.provide('exp.urlMap');

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
        READ: '/profile',
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
    },
    ORGS: {
        CREATE: '/organization/create',
        READ: '/organization',
        UPDATE: '/organization/update',
        DELETE: '/organization/delete'
    }
};