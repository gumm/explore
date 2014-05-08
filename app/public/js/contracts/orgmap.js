goog.provide('exp.orgMap');

/**
 * @param {Object} data
 * @returns {Object}
 */
exp.orgMap = function(data) {
  return  {
    profile: {
      orgName:    /** @type {?(string|number)} */ (data.orgName || null),
      orgUrl:     /** @type {?(string|number)} */ (data.orgUrl || null)
    },
    loc: {
      locStreet:  /** @type {?(string|number)} */ (data.locStreet || null),
      locSuburb:  /** @type {?(string|number)} */ (data.locSuburb || null),
      locCode:    /** @type {?(string|number)} */ (data.locCode || null),
      locCity:    /** @type {?(string|number)} */ (data.locCity || null),
      locCountry: /** @type {?(string|number)} */ (data.locCountry || null)
    },
    geo: {
      geoLng:     /** @type {?(string|number)} */ (data.geoLng || null),
      geoLat:     /** @type {?(string|number)} */ (data.geoLat || null),
      geoAddress: /** @type {?(string|number)} */ (data.geoAddress || null),
      geoZoom:    /** @type {?(string|number)} */ (data.geoZoom || null)
    },
    box: {
      boxNum:     /** @type {?(string|number)} */ (data.boxNum || null),
      boxSuburb:  /** @type {?(string|number)} */ (data.boxSuburb || null),
      boxCode:    /** @type {?(string|number)} */ (data.boxCode || null),
      boxCity:    /** @type {?(string|number)} */ (data.boxCity || null),
      boxCountry: /** @type {?(string|number)} */ (data.boxCountry || null)
    },
    media: {
      logo:       /** @type {?(string)} */ (data.mediaLogo || null),
      css:        /** @type {?(string)} */ (data.mediaCss || null)
    },
    bill: {
      billPlan:   /** @type {?(string|number)} */ (data.billPlan || null),
      billEmail:  /** @type {?(string|number)} */ (data.billEmail || null)
    },
    card: {
      crdName:    /** @type {?(string|number)} */ (data.crdName || null),
      crdType:    /** @type {?(string|number)} */ (data.crdType || null),
      crdNumber:  /** @type {?(string|number)} */ (data.crdNumber || null),
      crdExpDate: /** @type {?(string|number)} */ (data.crdExpDate || null),
      crdCvv:     /** @type {?(string|number)} */ (data.crdCvv || null)
    },
    members: /** @type {Array} */ ([]),
    owners: /** @type {Array} */ ([data.userId])
  };
};