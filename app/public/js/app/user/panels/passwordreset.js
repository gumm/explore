goog.provide('app.user.panel.PasswordReset');

goog.require('app.user.EventType');
goog.require('app.user.panel.Account');
goog.require('goog.dom');

/**
 * A form for resetting the users password, before login.
 * This is typically called when a user requested a password reset via email.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.user.panel.Account}
 * @constructor
 */
app.user.panel.PasswordReset = function(id, opt_domHelper) {
  app.user.panel.Account.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.PasswordReset, app.user.panel.Account);

app.user.panel.PasswordReset.prototype.initDom = function() {
  var formContainer = goog.dom.removeNode(
    goog.dom.getElement('pwreset')
  );
  var panelWrapper = goog.dom.getElementByClass(
    'pan-wrapper', this.getTarget());
  goog.dom.append(/** @type (!Node) */ (panelWrapper), formContainer);

  app.user.panel.PasswordReset.superClass_.initDom.call(this);
};

app.user.panel.PasswordReset.prototype.onCancel = function() {
  window.open(exp.urlMap.INDEX, '_self');
};

app.user.panel.PasswordReset.prototype.submit = function() {

  this.checkPasswordMatch();
  this.checkValidation();
  var form = this.getForm();

  if (form.checkValidity()) {
    var cred = this.getPostContentFromForm(form);
    var fail = goog.bind(this.displayErrors, this);
    var pass = goog.bind(this.dispatchActionEvent, this,
      app.user.EventType.LOGIN_SUCCESS);
    this.getUser().passwordReset(cred, pass, fail);
  }
};
