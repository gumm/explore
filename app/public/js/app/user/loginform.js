goog.provide('app.user.LoginForm');

goog.require('bad.ui.Form');

/**
 * The basic login form controller.
 * @param {!bad.Net} xMan
 * @param {!string} id
 * @param {!goog.Uri} uri
 * @param {Object} targetNest
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.LoginForm = function(xMan, id, uri, targetNest, opt_domHelper) {
    bad.ui.Form.call(this, id, uri, targetNest, opt_domHelper);

    /**
     * @type {bad.Net}
     */
    this.xMan = xMan;
};
goog.inherits(app.user.LoginForm, bad.ui.Form);

app.user.LoginForm.prototype.renderWithTemplate = function() {
    this.xMan.get(
        this.uri_,
        goog.bind(this.onRenderWithTemplateReply_, this));
};

app.user.LoginForm.prototype.onRenderWithTemplateReply_ = function(e) {
    var xhr = e.target;
    this.element_ = /** @type {Element} */ (goog.dom.htmlToDocumentFragment(
        xhr.getResponseText())
    );
    this.render(this.nest_.element);
};

app.user.LoginForm.prototype.enterDocument = function() {
    app.user.LoginForm.superClass_.enterDocument.call(this);

    this.form_ = this.getSterileFormFromId(this.id_);

    this.getHandler().listen(
        goog.dom.getElement('create-account'),
        goog.events.EventType.CLICK,
        function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchComponentEvent('create-account');
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

    this.dispatchComponentEvent(bad.ui.EventType.PANEL_READY);
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
    var data = xhr.getResponseJson();
    if (xhr.isSuccess()) {
        this.dispatchComponentEvent('login-success', data);
    } else {
        console.debug('Submit was not successful. Try again...', e, xhr);
    }
};
