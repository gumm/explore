goog.provide('exp.urlMap');

exp.urlMap = {
  INDEX: '/',
  LOG: {
    AUTO: '/auto',
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
    LOST: '/pw/lost',
    RESET: '/pw/reset',
    EDIT: '/pw/edit'
  },
  ACCOUNTS: {
    CREATE: '/accs/create',
    READ: '/accs/read',
    UPDATE: '/accs/update',
    DELETE: '/accs/delete'
  },
  ORGS: {
    CREATE: '/org/create',
    READ: '/org/read',
    UPDATE: '/org/update',
    DELETE: '/org/delete'
  }
};