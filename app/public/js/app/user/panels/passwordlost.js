goog.provide('app.user.panel.PasswordLost');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.utils');

/**
 * The basic login form controller.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.PasswordLost = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.PasswordLost, bad.ui.Form);

app.user.panel.PasswordLost.prototype.initDom = function() {
  bad.utils.makeButton('cancel', this,
    goog.bind(function() {
      this.clearAlerts();
      this.dispatchActionEvent(app.user.EventType.FORGOT_PW_CANCEL);
    }, this)
  );

  bad.utils.makeButton('submit', this,
    goog.bind(this.submit, this)
  );
};

app.user.panel.PasswordLost.prototype.onResetRequestSuccess = function(data) {
  this.displaySuccess(this.getForm().elements['email'], data['message']);
};

app.user.panel.PasswordLost.prototype.submit = function() {

  this.checkValidation();
  var form = this.getForm();

  if (form.checkValidity()) {
    var formData = this.getPostContentFromForm(form);
    var fail = goog.bind(this.displayErrors, this);
    var pass = goog.bind(this.onResetRequestSuccess, this);
    this.getUser().passwordLost(formData, pass, fail);
  }
};
