goog.provide('exp.urlMap');

exp.urlMap = {
    INDEX: '/',

    LOG: {
        AUTO: '/auto_login',
        IN: '/login',
        HEADER: '/login/header'
    },

    BASIC: {
        HOME: '/home',
        INTRO: '/intro',
        HEADER: '/header',
        LOGOUT: '/logout'
    },

    PW: {
        LOST:       '/pw/lost',
        RESET:      '/pw/reset',
        EDIT:       '/pw/edit'
    },
    ACCOUNTS: {
        CREATE:     '/accs/create',
        READ:       '/accs',
        UPDATE:     '/accs/update',
        DELETE:     '/accs/delete'
    },
    ORGS: {
        CREATE:     '/org/create',
        READ:       '/org',
        UPDATE:     '/org/update',
        DELETE:     '/org/delete'
    }
};