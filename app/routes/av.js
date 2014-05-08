var AM = require('../modules/account-manager');

goog.provide('exp.routes.av');

goog.require('exp.routesHelper');
goog.require('exp.airVantageSettings');
goog.require('exp.AirVantageOAuthAccess');
goog.require('exp.urlMap');
goog.require('goog.string');
goog.require('exp.airVantageSettings');

var AVAccess = exp.AirVantageOAuthAccess();

var helper = exp.routesHelper;
var request = require('request');
var fs = require('fs');

exp.routes.av.apiExpore= function(req, res) {
  var getCall = function() {
    if (!req.session.user) {
      res.redirect('/');
    } else {
      res.render('avapi/landing', {urlmap: exp.urlMap});
    }
  };
  helper.okGo(req, res, {'GET': getCall});
};

//-------------------------------------------------------------[ Basic Calls ]--

exp.routes.av.checkUserTokens = function(req, res, tokenName, callback) {
  var user = req.session.user;

  var onRefreshToken_ = function() {
    var accessToken = user.tokens[tokenName].access;
    var requestUrl = 'https://eu.airvantage.net/api' + req.url +
          '/?access_token=' + accessToken;
    console.log(requestUrl);
    callback(accessToken, requestUrl);
  };

  if (!user) {
    res.redirect('/');
  } else if (!user.tokens) {
    res.send(helper.makeReplyWith('Error', null, 'User has no tokens'), 200);
  } else if (!user.tokens[tokenName]) {
    res.send(helper.makeReplyWith('Error', null,
        'User has no token matching:' + tokenName), 200);
  } else if (user.tokens[tokenName].access) {
    exp.routes.av.refreshUserToken(req, res, user, user.tokens[tokenName], onRefreshToken_);
  }
};

exp.routes.av.removeUserTokens = function(req, res, user, tokenObj, callback) {

};

exp.routes.av.refreshUserToken = function(req, res, user, tokenObj, callback) {
  if (tokenObj.exp < new Date()) {
    console.log('This token is stale. We need to refresh it.');

    var onRefreshRequestReply_ = function(err, response, respBody) {
//      var reply = JSON.parse(respBody);
      console.log('HERE IS REFRESH REQUEST THE REPLY', err, '\n\n\n', response, '\n\n\n', respBody);

//      req.session.oauthAccessToken = accessToken;
//      req.session.oauthRefreshToken = refreshToken;
//
//      var tokenData = {
//        type: 'AV',
//        refresh: refreshToken,
//        access: accessToken,
//        exp: new Date().getTime() + results['expires_in'] * 1000
//      };
//      AM.updateAuthToken(req.session.user._id, tokenData, tokenUpdateCallback);


    };

    var options = {
      url: 'https://eu.airvantage.net/api/oauth/token',
      qs: {
        grant_type: 'refresh_token',
        refresh_token: tokenObj.refresh,
        client_id: exp.airVantageSettings.CLIENT_ID,
        client_secret: exp.airVantageSettings.CLIENT_SECRET
      }
    };
    request(options, onRefreshRequestReply_);
  } else {
    console.log(
        'Token still valid until:',
        new Date(tokenObj.exp).toLocaleString()
    );
    callback();
  }

};

//-------------------------------------------------------------[ Basic Calls ]--

exp.routes.av.basic = function(req, res) {

  exp.routes.av.checkUserTokens(req, res, 'AV', function(token, url) {
    AVAccess.get( url, token,
      function(err, result, response) {
        if (err) {

          var errReply = JSON.parse(err.data);
          console.log(err);

          var reply = function(error, account) {
            if (!error) {
              console.log('This goes to the front: ', err.statusCode, errReply.error);
              req.session.user = account;
              res.send(helper.makeReplyWith(
                errReply.error, null, errReply.error_description), 200);
            } else {
              res.send(helper.makeReplyWith(
                'Error', null, 'Your token was rejected by AV, and an error ' +
                      'occurred when trying to update your account locally. ' +
                      'The original AV error was: \nError: ' + errReply.error +
                      '\nDescription: ' + errReply.error_description  + '\n' +
                      'While updating your local account the following error ' +
                      'occurred: ' + error), 200);
            }
          };

          if (err.statusCode == 401 && errReply.error == 'invalid_token') {
            console.log('Need to delete tokens...');
            AM.deleteAuthToken(req.session.user._id, 'AV', reply);
          } else {
            reply();
          }


        } else if (response && response.statusCode === 200) {
          res.send(helper.makeReplyWith(
              null, JSON.parse(result), 'Success'), 200);
        } else {
          res.send(helper.makeReplyWith(
              'Error', null, 'Error reading from AV'), response.statusCode);
        }
      });
    });
};

exp.routes.av.binary = function(req, res) {

  exp.routes.av.checkUserTokens(req, res, 'AV', function(token, url) {
    var callback = function(err, response, respBody) {
      if (err) {
        var errReply = JSON.parse(err.data);
        res.send(helper.makeReplyWith(
            errReply.error, null, errReply.error_description), 200);
      } else if (response && response.statusCode === 200) {
        res.send(helper.makeReplyWith(
            null, respBody.toString('base64'), 'Success'), 200);
      } else {
        res.send(helper.makeReplyWith(
            'Error', null, 'Error on reading from AV'), response.statusCode);
      }
    };

    var options = {
      url: url,
      encoding: null
    };
    request(options, callback);
  });

};



