goog.provide('app.user.panel.Delete');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.utils');

/**
 * A delete account confirmation form.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.Delete = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.Delete, bad.ui.Form);

app.user.panel.Delete.prototype.initDom = function() {
  bad.utils.makeButton(
    'but-cancel', this,
    goog.bind(this.dispatchActionEvent, this,
      app.user.EventType.ACCOUNT_REMOVE_CANCELED));

  bad.utils.makeButton(
    'remove-account-confirm', this,
    goog.bind(this.submit, this)
  );
};

app.user.panel.Delete.prototype.submit = function() {

  this.checkValidation();
  var form = this.getForm();

  if (form.checkValidity()) {
    var cred = this.getPostContentFromForm(form);
    var fail = goog.bind(this.displayErrors, this);
    this.getUser().deleteAccount(cred, null, fail);
  }
};
