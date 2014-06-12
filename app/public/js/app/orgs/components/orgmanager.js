goog.provide('bad.OrgManager');

goog.require('exp.orgMap');

/**
 * A class to manage the organization data.
 * @constructor
 */
bad.OrgManager = function() {

  /**
   * @type {Object}
   * @private
   */
  this.org_ = exp.orgMap({});
};

/**
 * The data that comes in here is following the contract exp.orgMap
 * @param {Object} data
 */
bad.OrgManager.prototype.updateData = function(data) {
  this.org_ = data;
};

/**
 * @return {Object}
 */
bad.OrgManager.prototype.getData = function() {
  return this.org_;
};

/**
 * @return {?(string|number|undefined)}
 */
bad.OrgManager.prototype.getId = function() {
  return this.org_['_id'];
};

/**
 * @param {(string|number|null|undefined)} id
 */
bad.OrgManager.prototype.setId = function(id) {
  this.org_['_id'] = id;
};

/**
 * @return {?Object}
 */
bad.OrgManager.prototype.getProfile = function() {
  return this.org_['profile'];
};

/**
 * @return {?(string|number)}
 */
bad.OrgManager.prototype.getName = function() {
  return this.getProfile()['orgName'];
};

/**
 * @return {?Object}
 */
bad.OrgManager.prototype.getMedia = function() {
  return this.org_['media'];
};

/**
 * @return {?string}
 */
bad.OrgManager.prototype.getCss = function() {
  return this.getMedia()['css'];
};


