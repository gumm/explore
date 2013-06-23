goog.provide('app.user.LostPasswordForm');

goog.require('bad.ui.Form');

/**
 * The basic login form controller.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.LostPasswordForm = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.LostPasswordForm, bad.ui.Form);

app.user.LostPasswordForm.prototype.enterDocument = function() {

    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    this.getHandler().
        listen(
            this.cancelButton,
            goog.ui.Component.EventType.ACTION,
            function() {
                this.clearAlerts();
                //noinspection JSPotentiallyInvalidUsageOfThis
                this.dispatchComponentEvent('cancel');
            },undefined, this
        ).listen(
            this.submitButton,
            goog.ui.Component.EventType.ACTION,
            this.submitLostPasswordForm
        );


    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.LostPasswordForm.superClass_.enterDocument.call(this);
};

app.user.LostPasswordForm.prototype.initDom = function() {
    this.initCancelButton();
    this.initSubmitButton();
};

app.user.LostPasswordForm.prototype.initCancelButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('cancel'));
    this.cancelButton = button;
};

app.user.LostPasswordForm.prototype.initSubmitButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('submit'));
    this.submitButton = button;
};

app.user.LostPasswordForm.prototype.submitLostPasswordForm = function() {
    this.checkValidation();
    if (this.getForm().checkValidity()) {
        this.xMan.post(
            this.getUri(),
            this.getPostContentFromForm(this.getForm()),
            goog.bind(this.onSubmitLostPasswordForm, this)
        );
    }
};

app.user.LostPasswordForm.prototype.onSubmitLostPasswordForm = function(e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        var fields = this.getForm().elements;
        this.displaySuccess(fields['email'], data.message);
    } else {
        this.displayErrors(data);
    }
};
