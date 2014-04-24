goog.provide('exp.AirVantageOAuthAccess');

goog.require('exp.airVantageSettings');

var OAuth2 = require('oauth').OAuth2;

/**
 * @constructor
 */
exp.AirVantageOAuthAccess = function() {

  var oauthAccess = new OAuth2(
    exp.airVantageSettings.CLIENT_ID,
    exp.airVantageSettings.CLIENT_SECRET,
    exp.airVantageSettings.API_ROOT_URL,
    exp.airVantageSettings.AUTH_URL,
    exp.airVantageSettings.TOKEN_URL,
    null
  );

  oauthAccess.useAuthorizationHeaderforGET(true);
  return oauthAccess;
};