var crypto = require('crypto');
var BSON = require('mongodb').BSONPure;
var moment = require('moment');
var ORGS = require('./db-manager').orgs;

var makeOrg = function(data) {
    return {
        profile: {
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
};

var checkUniqueOrgName = function(orgName, callback) {
    ORGS.findOne(
        {'profile.orgName': orgName},
        callback
    );
};

/**
 * TODO: There is a lot that needs to happen here to secure the credit card.
 * One idea is to encrypt it with the pub-key of a 3rd party software app
 * that has read access to a separate db. Then pass it of the a broker from
 * where it is picked up and stored in that separate db. The 3rd party
 * app is internal to the org, and does not have a web interface.
 * Jobs on the broker is for writing into the db only.
 * @param newOrg
 * @param callback
 */
var addNewOrg = function(newOrg, callback) {

    var error = {
        orgName: null
    };

    var uniqueOrgNameCallback = function(err, org) {
        if (org) {
            error.orgName = 'This name is not available';
            callback(error);
        } else {
            newOrg.date = moment().format('MMMM Do YYYY, h:mm:ss a');
            ORGS.insert(newOrg, {safe: true}, function() {
                callback(null, newOrg);
            });
        }
    };
    checkUniqueOrgName(newOrg.profile.orgName, uniqueOrgNameCallback);
};

var getOrgsByUserId = function(userId, callback) {
    ORGS.find({'owners': userId}).toArray(callback);
};

var getOrgBId = function(id, callback) {
    ORGS.findOne({_id: BSON.ObjectID(id)}, function(err, org) {
        if(err) {
            console.log('ERROR', err);
            callback(err);
        } else {
            callback(null, org);
        }
    });
};

var updateProfile = function(uid, newOrg, subset, callback) {

    var findAndModifyCallback = function(err, account) {
        if (err){
            callback(err); // returns error if no matching object found
        } else {
            callback(null, account);
        }
    };

    ORGS.findAndModify(
        {_id: BSON.ObjectID(uid)}, // query
        [['_id','asc']],           // sort order
        {$set: {
            loc: newOrg.loc,
            box: newOrg.box,
            'profile.orgUrl': newOrg.profile.orgUrl}
        },
        {new: true}, // options new - if set to true, callback function
                     // returns the modified record.
                     // Default is false (original record is returned)
        findAndModifyCallback
    );
};

module.exports = {
    makeOrg: makeOrg,
    addNewOrg: addNewOrg,
    getOrgsByUserId: getOrgsByUserId,
    getOrgBId: getOrgBId,
    updateProfile: updateProfile
};

