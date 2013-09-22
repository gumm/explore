goog.provide('bad.OrgManager');

/**
 * A class to manage the organization data.
 * @constructor
 */
bad.OrgManager = function() {

  /**
   * @type {Object}
   * @private
   */
  this.org_ = {};
};

/**
 * The data that comes in here is following the contract exp.orgMap
 * @param {Object} data
 */
bad.OrgManager.prototype.updateData = function(data) {
  this.org_ = data;
};

bad.OrgManager.prototype.getData = function() {
  return this.org_;
};

bad.OrgManager.prototype.getId = function() {
  return this.org_['_id'];
};

bad.OrgManager.prototype.setId = function(id) {
  this.org_['_id'] = id;
};

bad.OrgManager.prototype.getProfile = function() {
  return this.org_['profile'];
};

bad.OrgManager.prototype.getName = function() {
  return this.getProfile()['orgName'];
};

bad.OrgManager.prototype.getMedia = function() {
  return this.org_['media'];
};

bad.OrgManager.prototype.getCss = function() {
  return this.getMedia()['css'];
};


