goog.provide('bad.UserManager');

goog.require('exp.accountMap');

/**
 * A class to manage the setting and getting of permissions.
 * @constructor
 */
bad.UserManager = function(opt_xMan) {
  this.xMan = opt_xMan;
  this.user_ = exp.accountMap({});
};

bad.UserManager.prototype.updateData = function(data) {
  this.user_ = data;
};

bad.UserManager.prototype.updateProfile = function(data) {
  this.user_['profile'] = data;
};

bad.UserManager.prototype.getId = function() {
  return this.user_['_id'];
};

bad.UserManager.prototype.setId = function(id) {
  this.user_['_id'] = id;
};

bad.UserManager.prototype.getProfile = function() {
  return this.user_['profile'];
};

bad.UserManager.prototype.getName = function() {
  return this.getProfile()['name'];
};

bad.UserManager.prototype.getSurname = function() {
  return this.getProfile()['surname'];
};

bad.UserManager.prototype.getSalutation = function() {
  var salutation = this.getName();
  var surname = this.getSurname();
  if (surname) {
    salutation = salutation + ' ' + surname;
  }
  return salutation;
};

bad.UserManager.prototype.updateTokensList = function(opt_callback) {
  if (this.xMan) {
    var callback = goog.bind(function(e) {
      var tokens = [];
      var xhr = e.target;
      if (xhr.isSuccess()) {
        var data = xhr.getResponseJson();
        if (!data.error) {
           tokens = data['data'];
           this.user_['tokens'] = tokens;
        }
      }
      if(opt_callback) {
        opt_callback(tokens);
      }
    }, this);
    this.xMan.get(
      new goog.Uri(exp.urlMap.ACCOUNTS.TOKENS),
      callback
    );
  }
};

bad.UserManager.prototype.updateAVAccount = function(opt_callback) {
  if (this.xMan) {
    var callback = goog.bind(function(e) {
      var xhr = e.target;
      var avAccoount = this.user_['avAccount'];
      if (xhr.isSuccess()) {
        var data = xhr.getResponseJson();
        if (!data.error) {
          avAccoount = data['data'];
          this.user_['avAccount'] = avAccoount;
        }
      }
      if(opt_callback) {
        opt_callback(avAccoount);
      }
    }, this);
    this.xMan.get(
      new goog.Uri(exp.urlMap.AV.USER.CURRENT),
      callback
    );
  }
};

