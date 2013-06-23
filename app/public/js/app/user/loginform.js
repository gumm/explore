goog.provide('app.user.LoginForm');

goog.require('bad.ui.Form');
goog.require('goog.ui.Css3ButtonRenderer');
goog.require('goog.ui.CustomButton');

/**
 * The basic login form controller.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.LoginForm = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.LoginForm, bad.ui.Form);

app.user.LoginForm.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    // Pass the sign-up portion of the dom up to the view to be added
    // elsewhere.
    this.dispatchComponentEvent('have-sign-up',
        goog.dom.removeNode(goog.dom.getElement('signup'))
    );

    this.getHandler().listen(
        this.signUpButton,
        goog.ui.Component.EventType.ACTION,
        function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchComponentEvent('sign-up');
        }, undefined, this
    ).listen(
        goog.dom.getElement('forgot-password'),
        goog.events.EventType.CLICK,
        function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchComponentEvent('forgot-password');
        }, undefined, this
    ).listen(
        this.loginButton,
        goog.ui.Component.EventType.ACTION,
        this.submitLoginForm
    );

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.LoginForm.superClass_.enterDocument.call(this);
};

app.user.LoginForm.prototype.initDom = function() {
    this.initLoginButton();
    this.initSignUpButton();
};

app.user.LoginForm.prototype.initLoginButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('btn-login'));
    this.loginButton = button;
};

app.user.LoginForm.prototype.initSignUpButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('create-account'));
    this.signUpButton = button;
};

app.user.LoginForm.prototype.submitLoginForm = function() {
    this.checkValidation();
    if (this.getForm().checkValidity()) {
        this.logIn(this.getPostContentFromForm(this.getForm()));
    }
};

app.user.LoginForm.prototype.logIn = function(credential) {
    this.xMan.post(
        this.getUri(),
        credential,
        goog.bind(this.loginCallback, this)
    );
};

app.user.LoginForm.prototype.loginCallback = function(e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        this.dispatchComponentEvent('login-success', data.data);
    } else {
        this.displayErrors(data);
    }
};


