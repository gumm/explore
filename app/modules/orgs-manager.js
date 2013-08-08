var crypto = require('crypto');
var BSON = require('mongodb').BSONPure;
var moment = require('moment');
var ORGS = require('./db-manager').orgs;

var makeOrgSchema = function(data) {
    return {
        profile: {
            name: data.name || null,
            url: data.url || null,
            location: {
                street: data.street || null,
                suburb: data.suburb || null,
                locationCode: data.locationCode || null,
                city: data.locationCity || null,
                country: data.locationCountry || null
            },
            postal: {
                boxNum: data.boxNum || null,
                suburb: data.postalSuburb || null,
                postalCode: data.postalCode || null,
                city: data.postalCity || null,
                country: data.postalCountry || null
            },
            contact: data.contactId || null
        },
        media: {
            logo: null,
            css: null
        },
        members: [data.contactId] || []
    };
};

/* record insertion, update & deletion methods */

var createOrg = function(newOrg, callback) {

    var createOrganization = function(newOrg) {
        newOrg.date = moment().format('MMMM Do YYYY, h:mm:ss a');
        ORGS.insert(newOrg, {safe: true}, function() {
            callback(null, newOrg.profile);
        });
    };
    createOrganization(newOrg);
};

var getOrgsByUserId = function(userId, callback) {

    var whenFound = function(e, res) {
        if (e) {
            callback(e);
        } else {
            callback(null, res);
        }
    };
    ORGS.find({'members': userId}).toArray(whenFound);




//    ORGS.find({'members': userId}, function(e, orgs) {
//        if (orgs) {
//            console.log('Here is the list of orgs:', orgs);
//            callback(null, orgs);
//        } else {
//            var error = 'User not a member of any orgs';
//            console.error(error);
//            callback(error, null);
//        }
//    });
};


module.exports = {
    createOrg: createOrg,
    getOrgsByUserId: getOrgsByUserId
};