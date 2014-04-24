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
    TRACE: '/trace',
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
    DELETE: '/accs/delete',
    TOKENS: '/accs/tokens'
  },
  ORGS: {
    CREATE: '/org/create',
    READ: '/org/read',
    UPDATE: '/org/update',
    DELETE: '/org/delete'
  },
  AV: {
    AUTH: {
      CONNECT: '/auth/av/connect',
      CALLBACK: '/auth/av/callback',
      AUTHORIZE: '/auth/av/authorize'
    },
    USER: {
      FIND: '/v1/users',
      CURRENT: '/v1/users/current',
      RIGHTS: '/v1/users/rights'
    }
  }
};