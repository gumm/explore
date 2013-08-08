goog.provide('app.user.panel.Login');

goog.require('bad.ui.Form');
goog.require('goog.ui.Css3ButtonRenderer');
goog.require('goog.ui.CustomButton');

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

app.user.panel.Login.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    this.getHandler().listen(
        goog.dom.getElement('forgot-password'),
        goog.events.EventType.CLICK,
        function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchActionEvent(app.user.EventType.FORGOT_PW);
        }, undefined, this
    );

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.panel.Login.superClass_.enterDocument.call(this);
};

app.user.panel.Login.prototype.initDom = function() {
    bad.utils.makeButton('btn-login',
        goog.bind(this.submitLoginForm, this)
    );
};

app.user.panel.Login.prototype.submitLoginForm = function() {
    this.checkValidation();
    if (this.getForm().checkValidity()) {
        this.logIn(this.getPostContentFromForm(this.getForm()));
    }
};

/**
 * @param {string} credential The users login credentials.
 */
app.user.panel.Login.prototype.logIn = function(credential) {
    this.xMan.post(
        this.getUri(),
        credential,
        goog.bind(this.loginCallback, this)
    );
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.Login.prototype.loginCallback = function(e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        var userProfile = data['data'];
        this.dispatchActionEvent(
            app.user.EventType.LOGIN_SUCCESS, userProfile);
    } else {
        this.displayErrors(data);
    }
};


