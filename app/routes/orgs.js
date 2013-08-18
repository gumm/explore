var AM = require('../modules/account-manager');
var OM = require('../modules/orgs-manager');

goog.provide('exp.routes.orgs');

goog.require('exp.cCardMap');
goog.require('exp.EmailDispatcher');
goog.require('exp.routesHelper');
goog.require('goog.object');
goog.require('exp.productMap');

var helper = exp.routesHelper;

//--------------------------------------------------------------------[ Edit ]--

exp.routes.orgs.create = function(req, res) {
    var getCall = function() {
        res.render('orgs/create', {
                countries: exp.countryList,
                products: exp.productMap,
                orgObj: OM.makeOrg({}),
                cCards: exp.cCardMap});
    };

    var postCall = function() {
        var user = req.session.user;
        var newOrg = OM.makeOrg({
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

    if(id && !subset) {
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
            res.render('orgs/list', {oList: list});
        }
    };

    var getCall = function() {
        OM.getOrgsByUserId(user._id, callback);
    };

    helper.okGo(req, res, {'GET': getCall});
};

exp.routes.orgs.readOne_ = function(req, res, id, opt_subset) {
    var callback;
    if (opt_subset) {
        var subset = opt_subset;
        callback = function(err, org) {
            if (err) {
                res.send(
                    helper.makeReplyWith(
                        'Could not get organizations' + err), 400);
            } else {
                if(org[subset]) {
                    res.send(
                        helper.makeReplyWith(
                            null, org[subset], 'Subset: ' + subset), 200);
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
                res.render('orgs/view', {orgObj: org});
            }
        };
    }

    var getCall = function() {
        OM.getOrgBId(id, callback);
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
            console.log('HERE IS THE ORG TO EDIT:', org);
            res.render('orgs/edit/' + subset, {
                countries: exp.countryList,
                orgObj: org,
                products: exp.productMap,
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


    /**
     * profile: {
            orgName: data.orgName || null,
            orgUrl: data.orgUrl || null
        },
        loc: {
            locStreet: data.locStreet || null,
            locSuburb: data.locSuburb || null,
            locCode: data.locCode || null,
            locCity: data.locCity || null,
            locCountry: data.locCountry || null,
            locCords: {
                cordLong: data.cordLong || null,
                cordLat: data.cordLat || null
            }
        },
        box: {
            boxNum: data.boxNum || null,
            boxSuburb: data.boxSuburb || null,
            boxCode: data.boxCode || null,
            boxCity: data.boxCity || null,
            boxCountry: data.boxCountry || null
        },
        media: {
            logo: null,
            css: null
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
     */

    /**
     * @param {Object} err The Error object if any.
     * @param {Object} org The full org object from mongo.
     */
    var postCallback = function(err, org) {
        if (err) {
            res.send(
                helper.makeReplyWith('Error updating org: ' + err),
                400);
        } else if(org) {
            res.send(
                helper.makeReplyWith(null, org, 'Org updated'),
                200);
        } else {
            res.send(
                helper.makeReplyWith('Could not find org'),
                400);
        }
    };

    var postCall = function() {
        var newOrg = OM.makeOrg({
            orgUrl: req.param('orgUrl'),
            locStreet: req.param('locStreet'),
            locSuburb: req.param('locSuburb'),
            locCode: req.param('locCode'),
            locCity: req.param('locCity'),
            locCountry: req.param('locCountry'),
            geoLng: req.param('geoLng'),
            geoLat: req.param('geoLat'),
            geoAddress: req.param('geoAddress'),
            geoZoom: req.param('geoZoom'),
            boxNum: req.param('boxNum'),
            boxSuburb: req.param('boxSuburb'),
            boxCode: req.param('boxCode'),
            boxCity: req.param('boxCity'),
            boxCountry: req.param('boxCountry'),
            billPlan: req.param('billPlan'),
            billEmail: req.param('billEmail'),
            logo: req.param('logo'),
            css: req.param('css'),
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

    var getCall = function() {
        res.render('orgs/edit', {});
    };

    var delCall = function() {
    };

    helper.okGo(req, res, {'GET': getCall, 'DELETE': delCall});
};