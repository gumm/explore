goog.provide('app.user.panel.LostPassword');

goog.require('bad.ui.Form');

/**
 * The basic login form controller.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.LostPassword = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.LostPassword, bad.ui.Form);

app.user.panel.LostPassword.prototype.enterDocument = function() {

    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.panel.LostPassword.superClass_.enterDocument.call(this);
};

app.user.panel.LostPassword.prototype.initDom = function() {
    bad.utils.makeButton('cancel',
        goog.bind(function() {
            this.clearAlerts();
            this.dispatchComponentEvent('cancel');
        }, this)
    );

    bad.utils.makeButton('submit',
        goog.bind(this.submitLostPasswordForm, this)
    );
};

app.user.panel.LostPassword.prototype.submitLostPasswordForm = function() {
    this.checkValidation();
    if (this.getForm().checkValidity()) {
        this.xMan.post(
            this.getUri(),
            this.getPostContentFromForm(this.getForm()),
            goog.bind(this.onSubmitLostPasswordForm, this)
        );
    }
};

app.user.panel.LostPassword.prototype.onSubmitLostPasswordForm = function(e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        var fields = this.getForm().elements;
        this.displaySuccess(fields['email'], data['message']);
    } else {
        this.displayErrors(data);
    }
};
