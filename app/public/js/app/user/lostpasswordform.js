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
    app.user.LostPasswordForm.superClass_.enterDocument.call(this);

    this.getHandler().
        listen(
            goog.dom.getElement('cancel'),
            goog.events.EventType.CLICK,
            function() {
                //noinspection JSPotentiallyInvalidUsageOfThis
                this.dispatchComponentEvent('cancel');
            },undefined, this
        ).listen(
            goog.dom.getElement('submit'),
            goog.events.EventType.CLICK,
            this.submitLostPasswordForm
        );
    this.dispatchComponentEvent(bad.ui.EventType.PANEL_READY);
};

app.user.LostPasswordForm.prototype.submitLostPasswordForm = function() {
    var constraintsValidate = this.form_.checkValidity();
    if (constraintsValidate) {
        var content = goog.dom.forms.getFormDataMap(this.form_).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            this.uri_,
            queryData,
            goog.bind(this.onSubmitLostPasswordForm, this)
        );
    }
};

app.user.LostPasswordForm.prototype.onSubmitLostPasswordForm = function(e) {
    var xhr = e.target;
    var alert = /** @type {!Node} */ (goog.dom.getElementByClass('alert'));
    goog.dom.removeChildren(alert);
    goog.dom.classes.remove(alert, 'alert-success', 'alert-error');
    var message = goog.dom.createDom('strong', {}, 'Done. ');
    if (xhr.isSuccess()) {
        goog.dom.append(alert, message,
            'Check your email on how to reset your password.');
        goog.dom.classes.add(alert, 'alert-success');
        goog.dom.classes.remove(alert, 'hide');
    } else {
        message = goog.dom.createDom('strong', {}, 'Error! ');
        goog.dom.append(alert, message,
            'Please enter a valid email address.');
        goog.dom.classes.add(alert, 'alert-error');
        goog.dom.classes.remove(alert, 'hide');
    }
};
