goog.provide('app.org.EventType');

/**
 * Constants for panel event.
 * @enum {string}
 */
app.org.EventType = {
  CANCEL: bad.utils.privateRandom(),
  CREATE: bad.utils.privateRandom(),
  READ: bad.utils.privateRandom(),
  VIEW_OWNER: bad.utils.privateRandom(),
  UPDATE_PROFILE: bad.utils.privateRandom(),
  UPDATE_PHYSICAL: bad.utils.privateRandom(),
  UPDATE_POSTAL: bad.utils.privateRandom(),
  UPDATE_BILLING: bad.utils.privateRandom(),
  UPDATE_SUCCESS: bad.utils.privateRandom(),
  DELETE: bad.utils.privateRandom(),
  ORG_DELETE_CANCELED: bad.utils.privateRandom(),
  ORG_DELETE_SUCCESS: bad.utils.privateRandom(),
  CHANGE_SCOPE: bad.utils.privateRandom()
};
