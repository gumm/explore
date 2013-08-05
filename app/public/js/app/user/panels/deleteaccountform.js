goog.provide('app.user.panel.DeleteAccount');

goog.require('bad.ui.Form');
goog.require('goog.ui.CustomButton');

/**
 * A delete account confirmation form.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.DeleteAccount = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);

    console.debug('Did this even init????')
};
goog.inherits(app.user.panel.DeleteAccount, bad.ui.Form);

app.user.panel.DeleteAccount.prototype.enterDocument = function() {

    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    this.getHandler().listen(
        this.cancelButton,
        goog.ui.Component.EventType.ACTION,
        function() {
            this.clearAlerts();
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchComponentEvent('confirm-cancel');
        }, undefined, this
    ).listen(
        this.removeAccountButton,
        goog.ui.Component.EventType.ACTION,
        function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.submitConfirmation();
        }, undefined, this
    );

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.panel.DeleteAccount.superClass_.enterDocument.call(this);
};

app.user.panel.DeleteAccount.prototype.initDom = function() {
    this.initCancelButton();
    this.initRemoveAccountButton();
};

app.user.panel.DeleteAccount.prototype.initCancelButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('remove-account-cancel'));
    this.cancelButton = button;
};

app.user.panel.DeleteAccount.prototype.initRemoveAccountButton = function() {
    var button = new goog.ui.CustomButton('',
        goog.ui.Css3ButtonRenderer.getInstance(), this.dom_);
    button.setSupportedState(goog.ui.Component.State.FOCUSED, false);
    button.decorate(goog.dom.getElement('remove-account-confirm'));
    this.removeAccountButton = button;
};

app.user.panel.DeleteAccount.prototype.submitConfirmation = function() {
    var form = this.getForm();
    this.checkValidation();

    if (form.checkValidity()) {
        var content = goog.dom.forms.getFormDataMap(form).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            this.getUri(),
            this.getPostContentFromForm(form),
            goog.bind(this.onConfirmation, this, queryData)
        );
    }
};

/**
* @param {string} queryData
* @param {goog.events.EventLike} e Event object.
*/
app.user.panel.DeleteAccount.prototype.onConfirmation = function(queryData, e) {
    var xhr = e.target;
    this.clearAlerts();
    if (xhr.isSuccess()) {
         window.open('/', '_self');
    } else {
        var data = xhr.getResponseJson();
        this.displayErrors(data);
    }
};
