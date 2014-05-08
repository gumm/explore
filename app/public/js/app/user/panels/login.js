goog.provide('app.user.panel.Login');

goog.require('app.user.EventType');
goog.require('bad.ui.Form');
goog.require('bad.utils');
goog.require('goog.dom');
goog.require('goog.events.EventType');

/**
 * The basic login form controller.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.Login = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.Login, bad.ui.Form);

app.user.panel.Login.prototype.initDom = function() {
  bad.utils.makeButton('btn-login', this,
    goog.bind(this.submit, this)
  );

  this.getHandler().listen(
    goog.dom.getElement('forgot-password'),
    goog.events.EventType.CLICK,
    function() {
      this.dispatchActionEvent(app.user.EventType.FORGOT_PW);
    }
  );
};

app.user.panel.Login.prototype.submit = function() {
  this.checkValidation();

  if (this.getForm().checkValidity()) {
    var cred = this.getPostContentFromForm(this.getForm());
    var fail = goog.bind(this.displayErrors, this);
    var pass = goog.bind(this.dispatchActionEvent, this,
      app.user.EventType.LOGIN_SUCCESS);
    this.getUser().login(cred, pass, fail);
  }
};


