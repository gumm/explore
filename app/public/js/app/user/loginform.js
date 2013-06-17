goog.provide('app.user.LoginForm');

goog.require('bad.ui.Form');

/**
 * The basic login form controller.
 * @param {!string} id
 * @param {!goog.Uri} uri
 * @param {Object} targetNest
 * @param {Object} activeNest
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.LoginForm = function(id, uri, targetNest, activeNest,
                              opt_domHelper) {
    bad.ui.Form.call(this, id, uri, targetNest, opt_domHelper);

    this.activeNest_ = activeNest;
};
goog.inherits(app.user.LoginForm, bad.ui.Form);

app.user.LoginForm.prototype.enterDocument = function() {
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

    this.topFix = goog.dom.getElement('signup');
    app.user.LoginForm.superClass_.enterDocument.call(this);
};

app.user.LoginForm.prototype.submitLoginForm = function() {
    if (this.form_.checkValidity()) {
        this.logIn(this.getPostContentFromForm(this.form_));
    }
};

app.user.LoginForm.prototype.logIn = function(credential) {
    this.xMan.post(
        this.uri_,
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

//-----------------------------------------------------------------[ Utility ]--

app.user.LoginForm.prototype.slideIn = function(size) {
    this.activeNest_.slideOpen(null, size,
        goog.bind(this.showSignUpButton_, this)
    );
};

/**
 * @param {Function=} opt_callback
 */
app.user.LoginForm.prototype.slideOut = function(opt_callback) {
    this.hideSignUpButton_();
    var callback = goog.bind(
        this.activeNest_.hide, this.activeNest_, opt_callback
    );
    this.activeNest_.slideClosed(callback);
};

app.user.LoginForm.prototype.showSignUpButton_ = function() {
    goog.dom.classes.remove(this.topFix, 'hide');
};

app.user.LoginForm.prototype.hideSignUpButton_ = function() {
    goog.dom.classes.add(this.topFix, 'hide');
};
