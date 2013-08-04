goog.provide('app.user.ResetPasswordForm');

goog.require('app.user.SignUpForm');

/**
 * A form for resetting the users password, before login.
 * This is typically called when a user requested a password reset via email.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.user.SignUpForm}
 * @constructor
 */
app.user.ResetPasswordForm = function(id, opt_domHelper) {
    app.user.SignUpForm.call(this, id, opt_domHelper);
};
goog.inherits(app.user.ResetPasswordForm, app.user.SignUpForm);

app.user.ResetPasswordForm.prototype.initDom = function() {
    var formContainer = goog.dom.removeNode(
        goog.dom.getElement('account-form-container')
    );
    var panelWrapper = goog.dom.getElementByClass(
        'pan-wrapper', this.getTarget());
    goog.dom.append(/** @type (!Node) */ (panelWrapper), formContainer);

    this.initCancelButton();
    this.initSubmitButton();
};

/**
 * @param {string} queryData The data that was submitted when resetting the,
 *      users password. It contains the password in clear text.
 * @param {goog.events.EventLike} e Event object.
 */
app.user.ResetPasswordForm.prototype.onSubmitSignUp = function(queryData, e) {

    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();

    if (xhr.isSuccess()) {
        this.xMan.post(
            new goog.Uri('/login'),
            queryData,
            goog.bind(this.loginCallback, this)
        );
    } else {
        this.displayErrors(data);
    }
};

app.user.ResetPasswordForm.prototype.loginCallback = function(e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        this.dispatchComponentEvent('login-success', data.data);
    } else {
        this.displayErrors(data);
    }
};
