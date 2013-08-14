var AM = require('../modules/account-manager');
var OM = require('../modules/orgs-manager');

goog.provide('exp.routes.orgs');

goog.require('exp.cCardMap');
goog.require('exp.EmailDispatcher');
goog.require('exp.routesHelper');

var helper = exp.routesHelper;

//--------------------------------------------------------------------[ Edit ]--

exp.routes.orgs.create = function(req, res) {
    var getCall = function() {
        res.render('orgs/create', {
                countries: exp.countryList,
                orgObj: OM.makeOrg({}),
                cCards: exp.cCardMap});
    };

    var postCall = function() {
        var user = req.session.user;
        var newOrg = OM.makeOrg({
            plan: req.param('plan'),
            orgName: req.param('orgName'),
            billingEmail: req.param('billingEmail'),
            type: req.param('cCardType'),
            number: req.param('number'),
            expDate: req.param('expDate'),
            cvv: req.param('expdate'),
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
    if(id) {
        exp.routes.orgs.readOne_(req, res, id);
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
            res.render('orgs/list', {oList: list});
        }
    };

    var getCall = function() {
        OM.getOrgsByUserId(user._id, callback);
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.readOne_ = function(req, res, id) {
    var callback = function(err, org) {
        if (err) {
            res.send(
                helper.makeReplyWith(
                    'Could not get organizations' + err), 400);
        } else {
            res.render('orgs/view', {orgObj: org});
        }
    };

    var getCall = function() {
        OM.getOrgBId(id, callback);
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.update = function(req, res) {

    var id = req.params.id;
    console.log('HERE IS THE ORG ID:', id, req.params);

//    /**
//     * @param {Object} err The Error object if any.
//     * @param {Object} account The full account object from mongo.
//     */
//    var callback = function(err, account) {
//        if (err) {
//            res.send(
//                helper.makeReplyWith('Error updating account: ' + err),
//                400);
//        } else if(account) {
//            req.session.user = account;
//            res.send(
//                helper.makeReplyWith(null, account.profile, 'Account updated'),
//                200);
//        } else {
//            res.send(
//                helper.makeReplyWith('Could not find account'),
//                400);
//        }
//    };
//
    var getCallback = function(err, org) {
        if (err) {
            res.send(
                helper.makeReplyWith('Error finding account: ' + err),
                400);
        } else if (org) {
            console.log('HERE IS THE ORG TO EDIT:', org);
            res.render('orgs/edit', {
                countries: exp.countryList,
                orgObj: org,
                cCards: exp.cCardMap});
        } else {
            res.send(
                helper.makeReplyWith('Could not find org with that ID'),
                400);
        }
    };
    var getCall = function() {
        OM.getOrgBId(id, getCallback);
    };



//
//    var postCall = function() {
//        var currentUser = req.session.user;
//
//        // This is from the form.
//        var newData = AM.makeAccount({
//            name: req.param('name'),
//            surname: req.param('surname'),
//            email: req.param('email'),
//            url: req.param('url'),
//            user: req.param('user'),
//            pass: req.param('pass'),
//            city: req.param('city'),
//            country: req.param('country'),
//            phone: req.param('phone'),
//            cell: req.param('cell')
//        });
//        AM.updateProfile(currentUser._id, newData, callback);
//    };
//
    helper.okGo(req, res, {'GET': getCall});
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