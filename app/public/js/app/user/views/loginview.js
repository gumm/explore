goog.provide('app.user.view.Login');

goog.require('app.BasicView');
goog.require('app.doMap');
goog.require('app.user.EventType');
goog.require('app.user.panel.Account');
goog.require('app.user.panel.Login');
goog.require('app.user.panel.PasswordLost');
goog.require('app.user.panel.PasswordReset');
goog.require('bad.ui.EventType');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('goog.Uri');

/**
 * @constructor
 * @extends {app.BasicView}
 */
app.user.view.Login = function() {

  /**
   * When set to true, this will init the reset password panel instead of the
   * normal login panel.
   * @type {boolean}
   */
  this.reset = false;

  app.BasicView.call(this);
};
goog.inherits(app.user.view.Login, app.BasicView);

app.user.view.Login.prototype.setResetPassword = function(bool) {
  this.reset = bool;
};

app.user.view.Login.prototype.configurePanels = function() {

  var layout = this.getLayout();

  /**
   * Header Panel
   * @type {bad.ui.Panel}
   */
  this.headerPanel = new bad.ui.Panel();
  this.headerPanel.setUri(new goog.Uri(exp.urlMap.BASIC.HEADER));
  this.headerPanel.setNestAsTarget(layout.getNest('footer'));
  this.headerPanel.setBeforeReadyCallback(goog.bind(function() {
    bad.utils.makeButton('create-account', this.headerPanel,
      goog.bind(this.enterSignUpForm, this)
    );
  }, this));
  this.addPanelToView(bad.utils.makeId(), this.headerPanel);

  /**
   * Intro Panel
   * @type {bad.ui.Panel}
   */
  this.introPanel = new bad.ui.Panel();
  this.introPanel.setUri(new goog.Uri(exp.urlMap.BASIC.INTRO));
  this.introPanel.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView(bad.utils.makeId(), this.introPanel);

  /**
   * Login Form
   * @type {app.user.panel.Login}
   */
  this.loginPanel = new app.user.panel.Login('login-form');
  this.loginPanel.setUser(this.getUser());
  this.loginPanel.setUri(new goog.Uri(exp.urlMap.LOG.IN));
  this.loginPanel.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
  this.addPanelToView(bad.utils.makeId(), this.loginPanel);

  /**
   * Signup Form
   * @type {app.user.panel.Account}
   */
  this.signUpForm = new app.user.panel.Account('account-form');
  this.signUpForm.setUser(this.getUser());
  this.signUpForm.setUri(new goog.Uri(exp.urlMap.ACCOUNTS.CREATE));
  this.signUpForm.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView(bad.utils.makeId(), this.signUpForm);

  /**
   * Lost Password Form
   * @type {app.user.panel.PasswordLost}
   */
  this.lostPwForm = new app.user.panel.PasswordLost('get-credentials-form');
  this.lostPwForm.setUri(new goog.Uri(exp.urlMap.PW.LOST));
  this.lostPwForm.setUser(this.getUser());
  this.lostPwForm.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView(bad.utils.makeId(), this.lostPwForm);

  /**
   * A reset password form
   * @type {app.user.panel.PasswordReset}
   */
  this.resetPasswordForm = new app.user.panel.PasswordReset('account-form');
  this.resetPasswordForm.setUri(new goog.Uri(exp.urlMap.PW.RESET));
  this.resetPasswordForm.setUser(this.getUser());
  this.resetPasswordForm.setNestAsTarget(
    this.getLayout().getNest('main', 'center'));
  this.addPanelToView(bad.utils.makeId(), this.resetPasswordForm);
};

app.user.view.Login.prototype.displayPanels = function() {
  if (this.reset) {
    this.resetPasswordForm.render();
  } else {
    this.headerPanel.renderWithTemplate();
    this.introPanel.renderWithTemplate();
    this.loginPanel.renderWithTemplate();
  }
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.user.view.Login.prototype.onPanelAction = function(e) {

  var panel = e.target;
  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case bad.ui.EventType.READY:
      if (panel === this.loginPanel) {
        this.slideLoginIn();
      }
      break;
    case app.user.EventType.FORGOT_PW:
      this.enterLostPasswordForm();
      break;
    case app.user.EventType.LOGIN_SUCCESS:
      this.fetchHomePage();
      break;
    case app.user.EventType.SIGNUP_CANCEL:
      this.exitSignUpForm();
      break;
    case app.user.EventType.FORGOT_PW_CANCEL:
      this.exitLostPasswordForm();
      break;
    default:
      console.log('app.user.view.Login: No match for ', value);
  }
};

//-------------------------------------------------------------[ Log-In Form ]--

app.user.view.Login.prototype.slideLoginIn = function() {
  var size = 350;
  var nest = this.getLayout().getNest('main', 'right');
  nest.slideOpen(null, size,
    goog.bind(this.headerPanel.show, this.headerPanel)
  );
};

/**
 * @param {Function=} opt_callback
 */
app.user.view.Login.prototype.slideLoginOut = function(opt_callback) {
  var nest = this.getLayout().getNest('main', 'right');

  if (this.headerPanel.isInDocument()) {
    this.headerPanel.hide();
  }
  var callback = goog.bind(nest.hide, nest, opt_callback);
  nest.slideClosed(callback);
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.user.view.Login.prototype.enterSignUpForm = function() {
  if (this.signUpForm.isInDocument()) {
    this.introPanel.hide();
    this.signUpForm.show();
    this.slideLoginOut();
  } else {
    this.signUpForm.renderWithTemplate();
    this.introPanel.hide();
    this.slideLoginOut();
  }
};

app.user.view.Login.prototype.exitSignUpForm = function() {
  this.signUpForm.hide();
  this.introPanel.show();
  this.slideLoginIn();
};

//------------------------------------------------------[ Lost Password Form ]--

app.user.view.Login.prototype.enterLostPasswordForm = function() {
  if (this.lostPwForm.isInDocument()) {
    this.introPanel.hide();
    this.lostPwForm.show();
    this.slideLoginOut();
  } else {
    this.lostPwForm.renderWithTemplate();
    this.introPanel.hide();
    this.slideLoginOut();
  }
};

app.user.view.Login.prototype.exitLostPasswordForm = function() {
  this.lostPwForm.hide();
  this.introPanel.show();
  this.slideLoginIn();
};

//---------------------------------------------------------------[ Home Page ]--


app.user.view.Login.prototype.fetchHomePage = function() {
  var callback = goog.bind(function() {
    this.appDo(app.doMap.USER_LOGGED_IN);
  }, this);
  this.slideLoginOut(callback);
};
