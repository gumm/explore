goog.provide('app.user.panel.Account');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.utils');
goog.require('goog.dom');

/**
 * The basic login form controller.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.Account = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.Account, bad.ui.Form);

app.user.panel.Account.prototype.initDom = function() {

  bad.utils.makeButton('account-cancel', this,
    goog.bind(this.onCancel, this)
  );

  bad.utils.makeButton('account-submit', this,
    goog.bind(this.submit, this)
  );

  var removeAccount = goog.dom.getElement('remove-account');
  if (removeAccount) {
    bad.utils.makeButton('remove-account', this,
      goog.bind(this.dispatchActionEvent, this,
        app.user.EventType.ACCOUNT_REMOVE)
    );
  }
};

app.user.panel.Account.prototype.onCancel = function() {
  this.clearAlerts();
  this.dispatchActionEvent(app.user.EventType.SIGNUP_CANCEL);
};

/**
 * Internally check that the passwords match.
 * @return {!boolean}
 */
app.user.panel.Account.prototype.checkPasswordMatch = function() {
  var password1 = document.getElementById('pass-tf');
  var password2 = document.getElementById('confpass-tf');
  if (password1 && password2) {
    if (password1.value !== password2.value) {
      password2.setCustomValidity('Passwords must match.');
      return false;
    } else {
      password2.setCustomValidity('');
      return true;
    }
  }
  return true;
};

app.user.panel.Account.prototype.submit = function() {

  this.checkPasswordMatch();
  this.checkValidation();
  var form = this.getForm();

  if (form.checkValidity()) {
    var cred = this.getPostContentFromForm(form);
    var fail = goog.bind(this.displayErrors, this);
    var pass = goog.bind(this.dispatchActionEvent, this,
      app.user.EventType.LOGIN_SUCCESS);
    this.getUser().signUp(cred, pass, fail);
  }
};



