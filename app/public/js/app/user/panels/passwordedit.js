goog.provide('app.user.panel.PasswordEdit');

goog.require('app.user.EventType');
goog.require('app.user.panel.Account');

/**
 * The user edit from.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.user.panel.Account}
 * @constructor
 */
app.user.panel.PasswordEdit = function(id, opt_domHelper) {
  app.user.panel.Account.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.PasswordEdit, app.user.panel.Account);


app.user.panel.PasswordEdit.prototype.submit = function() {

  this.checkPasswordMatch();
  this.checkValidation();
  var form = this.getForm();

  if (form.checkValidity()) {
    var cred = this.getPostContentFromForm(form);
    var fail = goog.bind(this.displayErrors, this);
    var pass = goog.bind(this.dispatchActionEvent, this,
      app.user.EventType.EDIT_PASSWORD_SUCCESS);
    this.getUser().passwordEdit(cred, pass, fail);
  }
};



