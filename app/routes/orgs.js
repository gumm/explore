var AM = require('../modules/account-manager');
var OM = require('../modules/orgs-manager');

goog.provide('exp.routes.orgs');

goog.require('exp.countryList');
goog.require('exp.EmailDispatcher');
goog.require('exp.routesHelper');

var helper = exp.routesHelper;

//--------------------------------------------------------------------[ Edit ]--

exp.routes.orgs.create = function(req, res) {
    var getCall = function() {
        res.render('orgs/create', {});
    };

    var postCall = function() {

    };

    helper.okGo(req, res, {'GET': getCall, 'POST': postCall});
};

exp.routes.orgs.list = function(req, res) {
    var user = req.session.user;
    var callback = function(err, list) {
        if (err) {
             res.send(
                    helper.makeReplyWith(
                        'Could not get organizations' + err), 400);
        } else {
            res.render('orgs/list', {olist: list});
        }
    };

    var getCall = function() {
        OM.getOrgsByUserId(user._id, callback);
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.getById = function(req, res) {
    var id = req.params.id;
    console.log('WHOO-HOO ID ---->', id);

    var getCall = function() {
        res.render('orgs/edit', {});
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.edit = function(req, res) {
    var id = req.params.id;

    var getCall = function() {
        res.render('orgs/edit', {});
    };

    var putCall = function() {
    };

    helper.okGo(req, res, {'GET': getCall, 'PUT': putCall});
};

exp.routes.orgs.delete = function(req, res) {
    var id = req.params.id;

    var getCall = function() {
        res.render('orgs/edit', {});
    };

    var delCall = function() {
    };

    helper.okGo(req, res, {'GET': getCall, 'DELETE': delCall});
};