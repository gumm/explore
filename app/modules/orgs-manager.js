var crypto = require('crypto');
var BSON = require('mongodb').BSONPure;
var moment = require('moment');
var ORGS = require('./db-manager').orgs;

var makeOrg = function(data) {
    return {
        profile: {
            orgName: data.orgName || null,
            orgUrl: data.orgUrl || null,
            location: {
                street: data.street || null,
                suburb: data.suburb || null,
                locationCode: data.locationCode || null,
                city: data.locationCity || null,
                country: data.locationCountry || null,
                coordinates: {
                    longitude: data.longitude || null,
                    latitude: data.latitude || null
                }
            },
            postal: {
                boxNum: data.boxNum || null,
                suburb: data.postalSuburb || null,
                postalCode: data.postalCode || null,
                city: data.postalCity || null,
                country: data.postalCountry || null
            },
            media: {
                logo: null,
                css: null
            }
        },
        billing: {
            billingEmail: data.billingEmail || null,
            card: {
                type: data.type || null,
                number: data.number || null,
                expDate: data.expDate || null,
                cvv: data.cvv || null
            }
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

module.exports = {
    makeOrg: makeOrg,
    addNewOrg: addNewOrg,
    getOrgsByUserId: getOrgsByUserId,
    getOrgBId: getOrgBId
};

