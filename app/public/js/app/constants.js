goog.provide('app.doMap');

goog.require('bad.utils');

/**
 * @enum {!string}
 */
app.doMap = {
  VIEW_EDIT_USER: bad.utils.privateRandom(),
  USER_LOGGED_IN: bad.utils.privateRandom(),
  VIEW_LOGIN: bad.utils.privateRandom(),
  RESET_PASSWORD: 'resetpw',
  AUTO: bad.utils.privateRandom(),
  VIEW_HOME: bad.utils.privateRandom(),
  VIEW_ORG_CREATE: bad.utils.privateRandom(),
  VIEW_ORG: bad.utils.privateRandom(),
  SWAP_THEME: bad.utils.privateRandom(),
  NESTS_SLIDE_CLOSE_ALL: bad.utils.privateRandom(),
  NESTS_HIDE_ALL: bad.utils.privateRandom()
};
