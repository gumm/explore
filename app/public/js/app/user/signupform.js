goog.provide('app.user.SignUpForm');

goog.require('bad.ui.Form');

/**
 * The basic login form controller.
 * @param {!string} id
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.SignUpForm = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.SignUpForm, bad.ui.Form);

app.user.SignUpForm.prototype.enterDocument = function() {
    this.getHandler().listen(
        goog.dom.getElement('account-cancel'),
        goog.events.EventType.CLICK,
        function() {
            //noinspection JSPotentiallyInvalidUsageOfThis
            this.dispatchComponentEvent('account-cancel');
        }, undefined, this
    ).listen(
        goog.dom.getElement('account-submit'),
        goog.events.EventType.CLICK,
        this.submitSignUp
    );
    app.user.SignUpForm.superClass_.enterDocument.call(this);
};

app.user.SignUpForm.prototype.submitSignUp = function() {
    var countryList = goog.dom.forms.getValueByName(this.form_, 'country');
    if (this.form_.checkValidity() &&
        countryList !== 'Please select a country') {
        var content = goog.dom.forms.getFormDataMap(this.form_).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            this.uri_,
            queryData,
            goog.bind(this.onSubmitSignUp, this, queryData)
        );
    }
};

/**
 * @param {string} queryData
 * @param {goog.events.EventLike} e Event object.
 */
app.user.SignUpForm.prototype.onSubmitSignUp = function(queryData, e) {
    var xhr = e.target;

    if (xhr.isSuccess()) {
        this.dispatchComponentEvent('signup-success', queryData);
    } else {
        console.debug('Submit was not successful. Try again...', e, xhr);
    }
};
