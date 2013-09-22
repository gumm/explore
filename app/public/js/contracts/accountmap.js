goog.provide('exp.accountMap');

/**
 * @param data
 * @returns {Object.<string, (Object|boolean|string|number)>}
 */
exp.accountMap = function(data) {
  return {
    profile: {
      name: data.name || null,
      surname: data.surname || null,
      email: data.email || null,
      url: data.url || null,
      location: {
        city: data.city || null,
        country: data.country || null
      },
      contact: {
        phone: data.phone || null,
        cell: data.cell || null
      }
    },
    credentials: {
      pass: data.pass || null,
      user: data.user || null
    }
  };
};