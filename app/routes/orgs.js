var AM = require('../modules/account-manager');
var OM = require('../modules/orgs-manager');

goog.provide('exp.routes.orgs');

goog.require('exp.cCardMap');
goog.require('exp.EmailDispatcher');
goog.require('exp.routesHelper');
goog.require('goog.object');
goog.require('exp.productMap');
goog.require('exp.themes');
goog.require('exp.orgMap');

var helper = exp.routesHelper;

//--------------------------------------------------------------------[ Edit ]--

exp.routes.orgs.create = function(req, res) {
  var getCall = function() {
    res.render('orgs/create', {
      countries: exp.countryList,
      products: exp.productMap,
      themes: exp.themes,
      orgObj: exp.orgMap({}),
      cCards: exp.cCardMap});
  };

  var postCall = function() {
    var user = req.session.user;
    var newOrg = exp.orgMap({
      orgName: req.param('orgName'),
      billPlan: req.param('billPlan'),
      billEmail: req.param('billEmail'),
      crdName: req.param('crdName'),
      crdType: req.param('crdType'),
      crdNumber: req.param('crdNumber'),
      crdExpDate: req.param('crdExpDate'),
      crdCvv: req.param('crdCvv'),
      userId: user._id
    });
    var callback = function(error, profile) {
      if (error) {
        res.send(helper.makeReplyWith(error), 400);
      } else {
        res.send(
          helper.makeReplyWith(null, profile, 'New org created'),
          200);
      }
    };
    OM.addNewOrg(newOrg, callback);
  };
  helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exp.routes.orgs.read = function(req, res) {
  var id = req.params.id;
  var subset = req.params.subset;

  if (id && !subset) {
    exp.routes.orgs.readOne_(req, res, id);
  } else if (id && subset) {
    exp.routes.orgs.readOne_(req, res, id, subset);
  } else {
    exp.routes.orgs.readList_(req, res);
  }
};

exp.routes.orgs.readList_ = function(req, res) {
  var user = req.session.user;
  var callback = function(err, list) {
    if (err) {
      res.send(
        helper.makeReplyWith(
          'Could not get organizations' + err), 400);
    } else {
      res.render('orgs/list', {
        themes: exp.themes,
        oList: list
      });
    }
  };

  var getCall = function() {
    OM.getOrgsByOwnerId(user._id, callback);
  };

  helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.readOne_ = function(req, res, id, opt_subset) {
  var callback;

  var getUsername = function(acc) {
    var salutation = acc.profile.name;
    if (acc.profile.surname) {
      salutation = salutation + ' ' + acc.profile.surname;
    }
    return salutation;
  };

  if (opt_subset) {
    var subset = opt_subset;
    callback = function(err, org) {
      if (err) {
        res.send(
          helper.makeReplyWith(
            'Could not get organizations' + err), 400);
      } else {
        if (org[subset]) {
          res.send(
            helper.makeReplyWith(
              null, org[subset], 'Subset: ' + subset), 200);
        } else if (subset === 'all') {
          res.send(
            helper.makeReplyWith(
              null, org, 'All org info'), 200);
        } else {
          res.send(
            helper.makeReplyWith(
              'Subset not available' + err), 400);
        }
      }
    };
  } else {
    callback = function(err, org) {
      if (err) {
        res.send(
          helper.makeReplyWith(
            'Could not get organizations' + err), 400);
      } else {
        AM.findById(org.owners[0], function(err, username) {
          if (err) {
            res.send(helper.makeReplyWith(err), 400);
          } else if (username) {
            org.owner = {uid: org.owners[0], salutation: username};
            res.render('orgs/view', {orgObj: org});
          } else {
            res.send(helper.makeReplyWith('No username found'), 400);
          }
        }, getUsername);

      }
    };
  }

  var getCall = function() {
    OM.getOrgById(id, callback);
  };

  helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.update = function(req, res) {
  var id = req.params.id;
  var subset = req.params.subset;
  var getCallback = function(err, org) {
    if (err) {
      res.send(
        helper.makeReplyWith('Error finding account: ' + err),
        400);
    } else if (org) {
      res.render('orgs/edit/' + subset, {
        countries: exp.countryList,
        orgObj: org,
        products: exp.productMap,
        themes: exp.themes,
        cCards: exp.cCardMap});
    } else {
      res.send(
        helper.makeReplyWith('Could not find org with that ID'),
        400);
    }
  };
  var getCall = function() {
    OM.getOrgById(id, getCallback);
  };

  /**
   * @param {Object} err The Error object if any.
   * @param {Object} org The full org object from mongo.
   */
  var postCallback = function(err, org) {
    if (err) {
      res.send(
        helper.makeReplyWith('Error updating org: ' + err),
        400);
    } else if (org) {
      res.send(
        helper.makeReplyWith(null, org, 'Org updated'),
        200);
    } else {
      res.send(
        helper.makeReplyWith('Could not find org'),
        400);
    }
  };

  var locCountry = req.param('locCountry') === exp.countryList[0].name ?
    null : req.param('locCountry');
  var boxCountry = req.param('boxCountry') === exp.countryList[0].name ?
    null : req.param('boxCountry');

  var postCall = function() {
    var newOrg = exp.orgMap({
      orgName: req.param('orgName'),
      orgUrl: req.param('orgUrl'),
      locStreet: req.param('locStreet'),
      locSuburb: req.param('locSuburb'),
      locCode: req.param('locCode'),
      locCity: req.param('locCity'),
      locCountry: locCountry,
      geoLng: req.param('geoLng'),
      geoLat: req.param('geoLat'),
      geoAddress: req.param('geoAddress'),
      geoZoom: req.param('geoZoom'),
      boxNum: req.param('boxNum'),
      boxSuburb: req.param('boxSuburb'),
      boxCode: req.param('boxCode'),
      boxCity: req.param('boxCity'),
      boxCountry: boxCountry,
      mediaLogo: req.param('mediaLogo'),
      mediaCss: req.param('mediaCss'),
      billPlan: req.param('billPlan'),
      billEmail: req.param('billEmail'),
      crdName: req.param('crdName'),
      crdType: req.param('crdType'),
      crdNumber: req.param('crdNumber'),
      crdExpDate: req.param('crdExpDate'),
      crdCvv: req.param('crdCvv')
    });
    OM.updateProfile(id, newOrg, subset, postCallback);
  };

  helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exp.routes.orgs.delete = function(req, res) {
  var id = req.params.id;
  var confPhrase = 'Please delete this organization and all its data';

  var getCall = function() {
    res.render('orgs/delete', {confPhrase: confPhrase});
  };

  var onGetAccountCallback = function(err, account) {
    if (!account) {
      res.send(helper.makeReplyWith(err), 400);
    } else {
      OM.getOrgById(id, function(err, org) {
        if (err) {
          res.send(helper.makeReplyWith(err), 400);
        } else {
          if (org.owners[0] == account._id) {
            OM.deleteOrg(id, function() {
              res.send(helper.makeReplyWith(
                null, null, 'Org deleted successfully'), 200);
            });
          } else {
            res.send(helper.makeReplyWith(
              'You are not listed as an owner of this org'), 400);
          }
        }
      });
    }
  };

  var postCall = function() {
    var user = req.param('user');
    var pass = req.param('pass');
    AM.manualLogin(user, pass, onGetAccountCallback);
  };

  helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};
