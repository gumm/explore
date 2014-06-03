goog.provide('bad.UserManager');

goog.require('exp.accountMap');
goog.require('goog.Promise');
goog.require('goog.uri.utils');
goog.require('goog.events.EventTarget');
goog.require('app.user.EventType');


/**
 * A class to manage the setting and getting of permissions.
 * @constructor
 * @extends {goog.events.EventTarget}
 */
bad.UserManager = function(opt_xMan) {
  goog.events.EventTarget.call(this);
  this.xMan = opt_xMan;
  this.user_ = exp.accountMap({});

  this.color_ = 'blue';
  this.mapstyle_ = bad.UserManager.MapStyles_[this.color_];
};
goog.inherits(bad.UserManager, goog.events.EventTarget);

bad.UserManager.MapStyles_ = {
  'orange': 'gumm.idjg6h8d',
  'red': 'gumm.idjb010j',
  'yellow': 'gumm.idjgj22h',
  'blue': 'gumm.idfoh2ko',
  'green': 'gumm.idjdo11i'
};


/**
 * A method for a user to sign up.
 * @param {string} formData The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.signUp = function(formData, success, err) {

  var onSuccess = function() {
    this.login(formData, success, err);
  };

  /**
   * @type {goog.Promise}
   */
  var signUp = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.ACCOUNTS.CREATE, formData), this);
  signUp.then(onSuccess, err, this);
};

/**
 * A method for a user to remove their account.
 * @param {string} formData The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.deleteAccount = function(formData, success, err) {

  var onSuccess = function() {
    window.open(exp.urlMap.INDEX, '_self');
  };

  /**
   * @type {goog.Promise}
   */
  var attemptDelete = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.ACCOUNTS.DELETE, formData), this);
  attemptDelete.then(onSuccess, err, this);
};

/**
 * A method for a user to log in.
 * @param {string} cred The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.login = function(cred, success, err) {
  var onSuccess = function(data) {
    this.updateProfile(data['data']);
    success();
  };

  /**
   * @type {goog.Promise}
   */
  var attemptLogin = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.LOG.IN, cred), this);
  attemptLogin.then(onSuccess, err, this);
};

/**
 * A method for a user to log out.
 */
bad.UserManager.prototype.logOut = function() {
  var formData = goog.uri.utils.buildQueryDataFromMap({'logout': true});

  var onSuccess = function() {
    window.open(exp.urlMap.INDEX, '_self');
  };

  /**
   * @type {goog.Promise}
   */
  var attemptLogout = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.BASIC.LOGOUT, formData), this);
  attemptLogout.then(onSuccess, null, this);
};

/**
 * A method for a user to edit their account details.
 * @param {string} formData The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.edit = function(formData, success, err) {

  var onSuccess = function(data) {
    this.updateProfile(data['data']);
    success(data);
  };

  /**
   * @type {goog.Promise}
   */
  var signUp = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.ACCOUNTS.UPDATE, formData), this);
  signUp.then(onSuccess, err, this);
};

/**
 * A method for a user to edit their account password.
 * @param {string} formData The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.passwordEdit = function(formData, success, err) {

  /**
   * @type {goog.Promise}
   */
  var attemptPasswordEdit = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.PW.EDIT, formData), this);
  attemptPasswordEdit.then(success, err, this);
};

/**
 * A method for a user to request that their password is reset.
 * @param {string} formData The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.passwordLost = function(formData, success, err) {

  /**
   * @type {goog.Promise}
   */
  var requestReset = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.PW.LOST, formData), this);
  requestReset.then(success, err, this);
};


/**
 * A method for a user to request that their password is reset.
 * @param {string} formData The encoded query string, in the form 'a=1&b=2'.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.passwordReset = function(formData, success, err) {

  var onSuccess = function(data) {
    this.login(formData, success, err);
  };

  /**
   * @type {goog.Promise}
   */
  var attemptReset = new goog.Promise(
      this.xMan.postJsonPromise(exp.urlMap.PW.RESET, formData), this);
  attemptReset.then(onSuccess, err, this);
};

/**
 * A method to attempt to automatic login. This depends on the users session.
 * @param {Function=} success
 * @param {Function=} err
 */
bad.UserManager.prototype.autoLogin = function(success, err) {
  var onSuccess = function(data) {
    this.updateProfile(data['data']);
    success(data);
  };

  /**
   * @type {goog.Promise}
   */
  var doAutoLogin = new goog.Promise(
      this.xMan.getJsonPromise(exp.urlMap.LOG.AUTO), this);
  doAutoLogin.then(onSuccess, err, this);
};

/**
 * Given an object representing the users data object, set it.
 * @param {Object} data
 */
bad.UserManager.prototype.updateData = function(data) {
  if (goog.isDefAndNotNull(data)) {
    this.user_ = data;
    this.dispatchEvent(app.user.EventType.USER_CHANGED);
  }
};

/**
 * Given an object representing the users profile, set it.
 * @param {Object} data
 */
bad.UserManager.prototype.updateProfile = function(data) {
  if (goog.isDefAndNotNull(data)) {
    this.user_['profile'] = data;
    this.dispatchEvent(app.user.EventType.USER_CHANGED);
  }
};

/**
 * @return {?(string|number)}
 */
bad.UserManager.prototype.getId = function() {
  return this.user_['_id'];
};

/**
 * Given a string or number, set the user's id.
 * @param {!(string|number)} id
 */
bad.UserManager.prototype.setId = function(id) {
  this.user_['_id'] = id;
};

/**
 * Returns the user's profile map.
 * @return {?Object}
 */
bad.UserManager.prototype.getProfile = function() {
  return this.user_['profile'];
};

/**
 * Returns the user's name (if any).
 * @return {?string}
 */
bad.UserManager.prototype.getName = function() {
  return this.getProfile()['name'];
};

/**
 * Returns the user's surname.
 * @return {*}
 */
bad.UserManager.prototype.getSurname = function() {
  return this.getProfile()['surname'];
};

/**
 * Returns a concatenation of the user's name and surname.
 * @return {?string}
 */
bad.UserManager.prototype.getSalutation = function() {
  var salutation = this.getName();
  var surname = this.getSurname();
  if (surname) {
    salutation = salutation + ' ' + surname;
  }
  return salutation;
};

bad.UserManager.prototype.setTheme = function(value) {

  console.debug('HERE IS THE NEW THEM COLOR:', value);


  this.color_ = value;
  this.mapstyle_ = bad.UserManager.MapStyles_[this.color_];

  console.debug('HERE IS THE NEW MAP THEME:', this.mapstyle_);
};

bad.UserManager.prototype.getTheme = function() {
  return this.mapstyle_;
};


