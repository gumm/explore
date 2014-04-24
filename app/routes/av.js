
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

exp.routes.av.basic = function(req, res) {

  var requestUrl = 'https://eu.airvantage.net/api' + req.url;
  var user = req.session.user;

  if (!user) {
    res.redirect('/');
  } else if (!user.tokens) {
    res.send(helper.makeReplyWith('User not authenticated for anything'), 200);
  } else if (!user.tokens.AV) {
    res.send(helper.makeReplyWith('User has no AirVantage Authentication'), 200);
  } else if (user.tokens.AV.access) {
    AVAccess.get(
      requestUrl,
      user.tokens.AV.access,
      function(err, result, response) {
        console.log(user.tokens.AV.access);
        if (err) {
          res.send(helper.makeReplyWith('Error on reading from AV'), 400);
        } else if (response && response.statusCode === 200) {
          res.send(helper.makeReplyWith(null, JSON.parse(result), 'Current user data'), 200);
        } else {
          res.send(helper.makeReplyWith('Error on reading from AV'), response.statusCode);
        }
      }
    );
  } else {
    res.send(helper.makeReplyWith("Eh... That's a negatory captain..."), 400);
  }
};

exp.routes.av.binary = function(req, res) {

  var user = req.session.user;
  var requestUrl = 'https://eu.airvantage.net/api' + req.url +
      '/?access_token=' + user.tokens.AV.access;

  var callback = function(error, message, respBody) {
    res.send(helper.makeReplyWith(null, respBody.toString('base64')), 200);
  };

  var options = {
    url: requestUrl,
    encoding: null
  };
  request(options, callback);

};



