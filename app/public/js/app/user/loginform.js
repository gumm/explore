goog.provide('app.user.LoginForm');

goog.require('bad.ui.Form');

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

    // Pass the sign-up portion of the dom up to the view to be added
    // elsewhere.
    this.dispatchComponentEvent('have-sign-up',
        goog.dom.removeNode(goog.dom.getElement('signup'))
    );

    this.getHandler().listen(
        goog.dom.getElement('create-account'),
        goog.events.EventType.CLICK,
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
        goog.dom.getElement('btn-login'),
        goog.events.EventType.CLICK,
        this.submitLoginForm
    );

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.LoginForm.superClass_.enterDocument.call(this);
};

app.user.LoginForm.prototype.submitLoginForm = function() {
    if (this.getForm().checkValidity()) {
        this.logIn(this.getPostContentFromForm(this.getForm()));
    }
};

app.user.LoginForm.prototype.logIn = function(credential) {
    this.xMan.post(
        this.getUri(),
        credential,
        goog.bind(this.onSubmitLoginForm, this)
    );
};

app.user.LoginForm.prototype.onSubmitLoginForm = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        var data = xhr.getResponseJson();
        this.dispatchComponentEvent('login-success', data);
    } else {
        console.debug('Submit was not successful. Try again...', e, xhr);
    }
};