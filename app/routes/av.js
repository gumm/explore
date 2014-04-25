
goog.provide('exp.routes.av');

goog.require('exp.routesHelper');
goog.require('exp.airVantageSettings');
goog.require('exp.AirVantageOAuthAccess');
goog.require('exp.urlMap');
goog.require('goog.string');

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
  if (!user) {
    res.redirect('/');
  } else if (!user.tokens) {
    res.send(helper.makeReplyWith('User has no tokens'), 200);
  } else if (!user.tokens[tokenName]) {
    res.send(helper.makeReplyWith('User has no token matching:' + tokenName), 200);
  } else if (user.tokens[tokenName].access) {
    callback(user.tokens[tokenName].access);
  }
};

//-------------------------------------------------------------[ Basic Calls ]--

exp.routes.av.basic = function(req, res) {

  exp.routes.av.checkUserTokens(req, res, 'AV', function(accessToken) {
    var requestUrl = 'https://eu.airvantage.net/api' + req.url;
    AVAccess.get( requestUrl, accessToken,
      function(err, result, response) {
        if (err) {
          console.log(err.statusCode);
          var errReply = JSON.parse(err.data);
          res.send(helper.makeReplyWith(errReply.error, {}, errReply.error_description), 200);
        } else if (response && response.statusCode === 200) {
          res.send(helper.makeReplyWith(null, JSON.parse(result), 'Success'), 200);
        } else {
          res.send(helper.makeReplyWith('Error on reading from AV'), response.statusCode);
        }
      }
    );
  });
};

exp.routes.av.binary = function(req, res) {

  exp.routes.av.checkUserTokens(req, res, 'AV', function(accessToken) {
    var requestUrl = 'https://eu.airvantage.net/api' + req.url +
        '/?access_token=' + accessToken;

    var callback = function(err, response, respBody) {
      if (err) {
        console.log(err.statusCode);
        var errReply = JSON.parse(err.data);
        res.send(helper.makeReplyWith(errReply.error, {}, errReply.error_description), 200);
      } else if (response && response.statusCode === 200) {
        res.send(helper.makeReplyWith(null, respBody.toString('base64')), 200);
      } else {
        res.send(helper.makeReplyWith('Error on reading from AV'), response.statusCode);
      }
    };

    var options = {
      url: requestUrl,
      encoding: null
    };
    request(options, callback);
  });

};



