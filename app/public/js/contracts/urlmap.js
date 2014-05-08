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
    RESET: '/pwreset',
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
    API: '/av/api/test',
    AUTH: {
      CONNECT: '/auth/av/connect',
      CALLBACK: '/auth/av/callback',
      AUTHORIZE: '/auth/av/authorize'
    },
    USER: {
      ALL: '/v1/users',
      DETAIL: '/v1/users/:uid',
      CURRENT: '/v1/users/current',
      RIGHTS: '/v1/users/rights',
      PICTURE_NORMAL: '/v1/users/:uid/picture/normal',
      PICTURE_SMALL: '/v1/users/:uid/picture/small',
      PICTURE_ICON: '/v1/users/:uid/picture/small',
      CLIENTS: '/v1/users/:uid/clients'
    }
  }
};