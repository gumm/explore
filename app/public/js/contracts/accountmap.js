goog.provide('exp.accountMap');

/**
 * @param {Object} data
 * @returns {Object}
 */
exp.accountMap = function(data) {
  return {
    profile: {
      name:       /** @type {?(string|number)} */ (data.name || null),
      surname:    /** @type {?(string|number)} */ (data.surname || null),
      email:      /** @type {?(string|number)} */ (data.email || null),
      url:        /** @type {?(string|number)} */ (data.url || null),
      location: {
        city:     /** @type {?(string|number)} */ (data.city || null),
        country:  /** @type {?(string|number)} */ (data.country || null)
      },
      contact: {
        phone:    /** @type {?(string|number)} */ (data.phone || null),
        cell:     /** @type {?(string|number)} */ (data.cell || null)
      }
    },
    credentials: {
      pass:       /** @type {?(string|number)} */ (data.pass || null),
      user:       /** @type {?(string|number)} */ (data.user || null)
    }
  };
};
