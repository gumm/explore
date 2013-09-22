var crypto = require('crypto');
var BSON = require('mongodb').BSONPure;
var moment = require('moment');
var ORGS = require('./db-manager').orgs;

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

var getOrgsByOwnerId = function(userId, callback) {
  var ownerId = userId.toString();
  ORGS.find({'owners': ownerId}).toArray(callback);
};

var getOrgById = function(id, callback) {
  ORGS.findOne({_id: BSON.ObjectID(id)}, function(err, org) {
    if (err) {
      console.log('ERROR', err);
      callback(err);
    } else {
      callback(null, org);
    }
  });
};

var updateProfile = function(uid, newOrg, subset, callback) {

  var findAndModifyCallback = function(err, account) {
    if (err) {
      callback(err); // returns error if no matching object found
    } else {
      callback(null, account);
    }
  };

  var doc = {};
  switch (subset) {
    case 'profile':
      doc = {$set: {
        'profile.orgName': newOrg.profile.orgName,
        'profile.orgUrl': newOrg.profile.orgUrl,
        media: newOrg.media}
      };
      break;
    case 'box':
      doc = {$set: {box: newOrg.box}};
      break;
    case 'loc':
      doc = {$set: {
        loc: newOrg.loc,
        geo: newOrg.geo
      }};
      break;
    case 'billing':
      doc = {$set: {
        bill: newOrg.bill,
        card: newOrg.card}
      };
      break;
    default:
      console.log('Unknown subset', subset);
  }

  ORGS.findAndModify(
    {_id: BSON.ObjectID(uid)}, // query
    [
      ['_id', 'asc']
    ],           // sort order
    doc,
    {new: true}, // options new - if set to true, callback function
    // returns the modified record.
    // Default is false (original record is returned)
    findAndModifyCallback
  );
};

var deleteOrg = function(id, callback) {
  ORGS.remove({_id: BSON.ObjectID(id)}, callback);
};

module.exports = {
//    makeOrg: makeOrg,
  addNewOrg: addNewOrg,
  getOrgsByOwnerId: getOrgsByOwnerId,
  getOrgById: getOrgById,
  updateProfile: updateProfile,
  deleteOrg: deleteOrg
};

