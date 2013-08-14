goog.provide('app.org.EventType');

/**
 * Constants for panel event.
 * @enum {string}
 */
app.org.EventType = {
    CREATE: bad.utils.privateRandom(),
    READ: bad.utils.privateRandom(),
    UPDATE_PROFILE: bad.utils.privateRandom(),
    UPDATE_EMAILS: bad.utils.privateRandom(),
    UPDATE_SECURITY: bad.utils.privateRandom(),
    UPDATE_BILLING: bad.utils.privateRandom(),
    DELETE: bad.utils.privateRandom()
};
