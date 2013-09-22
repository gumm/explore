goog.provide('exp.orgMap');

/**
 * @param data
 * @returns {Object.<string, (Object|boolean|string|number)>}
 */
exp.orgMap = function(data) {
  return  {
    profile: {
      orgName: data.orgName || null,
      orgUrl: data.orgUrl || null
    },
    loc: {
      locStreet: data.locStreet || null,
      locSuburb: data.locSuburb || null,
      locCode: data.locCode || null,
      locCity: data.locCity || null,
      locCountry: data.locCountry || null
    },
    geo: {
      geoLng: data.geoLng || null,
      geoLat: data.geoLat || null,
      geoAddress: data.geoAddress || null,
      geoZoom: data.geoZoom || null
    },
    box: {
      boxNum: data.boxNum || null,
      boxSuburb: data.boxSuburb || null,
      boxCode: data.boxCode || null,
      boxCity: data.boxCity || null,
      boxCountry: data.boxCountry || null
    },
    media: {
      logo: data.mediaLogo || null,
      css: data.mediaCss || null
    },
    bill: {
      billPlan: data.billPlan || null,
      billEmail: data.billEmail || null
    },
    card: {
      crdName: data.crdName || null,
      crdType: data.crdType || null,
      crdNumber: data.crdNumber || null,
      crdExpDate: data.crdExpDate || null,
      crdCvv: data.crdCvv || null
    },
    members: [],
    owners: [data.userId]
  };
};