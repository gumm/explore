goog.provide('app.user.panel.Edit');

goog.require('app.user.EventType');
goog.require('app.user.panel.Account');

/**
 * The user edit from.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.user.panel.Account}
 * @constructor
 */
app.user.panel.Edit = function(id, opt_domHelper) {
  app.user.panel.Account.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.Edit, app.user.panel.Account);


app.user.panel.Edit.prototype.submit = function() {

  this.checkPasswordMatch();
  this.checkValidation();
  var form = this.getForm();

  if (form.checkValidity()) {
    var cred = this.getPostContentFromForm(form);
    var fail = goog.bind(this.displayErrors, this);
    var pass = goog.bind(this.onSubmitSuccess, this);
    this.getUser().edit(cred, pass, fail);
  }
};

app.user.panel.Edit.prototype.onSubmitSuccess = function(data) {
  this.dispatchActionEvent(app.user.EventType.EDIT_ACCOUNT_SUCCESS, data);
};



