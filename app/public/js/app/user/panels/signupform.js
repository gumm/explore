goog.provide('app.user.panel.SignUp');

goog.require('bad.ui.Form');
goog.require('goog.ui.CustomButton');

/**
 * The basic login form controller.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.SignUp = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.SignUp, bad.ui.Form);

app.user.panel.SignUp.prototype.enterDocument = function() {

    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    this.getHandler().listen(
        this.cancelButton,
        goog.ui.Component.EventType.ACTION,
        function() {
            this.clearAlerts();
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchComponentEvent('account-cancel');
        }, undefined, this
    ).listen(
        this.submitButton,
        goog.ui.Component.EventType.ACTION,
        this.submitSignUp
    );

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.panel.SignUp.superClass_.enterDocument.call(this);
};

app.user.panel.SignUp.prototype.initDom = function() {
    this.initCancelButton();
    this.initSubmitButton();
};

app.user.panel.SignUp.prototype.initCancelButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('account-cancel'));
    this.cancelButton = button;
};

app.user.panel.SignUp.prototype.initSubmitButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('account-submit'));
    this.submitButton = button;
};

app.user.panel.SignUp.prototype.submitSignUp = function() {
    var form = this.getForm();
    this.checkPasswordMatch();
    this.checkValidation();

    if (form.checkValidity()) {
        var content = goog.dom.forms.getFormDataMap(form).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            this.getUri(),
            this.getPostContentFromForm(form),
            goog.bind(this.onSubmitSignUp, this, queryData)
        );
    }
};

app.user.panel.SignUp.prototype.checkPasswordMatch = function() {
    var password1 = document.getElementById('pass-tf');
    var password2 = document.getElementById('confpass-tf');
    if (password1 && password2) {
        if (password1.value !== password2.value) {
            password2.setCustomValidity('Passwords must match.');
            return false;
        } else {
            password2.setCustomValidity('');
            return true;
        }
    }
    return true;
};

/**
 * @param {string} queryData
 * @param {goog.events.EventLike} e Event object.
 */
app.user.panel.SignUp.prototype.onSubmitSignUp = function(queryData, e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        this.dispatchComponentEvent('signup-success',
            {query: queryData, reply: data}
        );
    } else {
        this.displayErrors(data);
    }
};
