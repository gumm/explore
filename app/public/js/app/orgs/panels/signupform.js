goog.provide('app.org.panel.SignUp');

goog.require('bad.ui.Form');
goog.require('exp.productMap');
goog.require('goog.ui.CustomButton');

/**
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.org.panel.SignUp = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);

    this.productButtons_ = {};
};
goog.inherits(app.org.panel.SignUp, bad.ui.Form);

app.org.panel.SignUp.prototype.initDom = function() {
    bad.utils.makeButton('orgFormCancel', this,
        goog.bind(this.onCancel, this)
    );

    bad.utils.makeButton('orgFormSubmit', this,
        goog.bind(this.submitSignUp, this)
    );

    if (this.dom_.getElement('bill')) {

        goog.object.forEach(exp.productMap, function(product, key) {
            this.productButtons_[key] = bad.utils.makeToggleButton(key, this,
                goog.bind(this.choosePlan_, this, key)
            );
        }, this);

        this.ccardEl = goog.dom.getElement('card');
        goog.style.setElementShown(this.ccardEl, false);

        this.planType = goog.dom.getElement('billPlan');
        this.choosePlan_(this.planType.value || 'free');
    }
};

app.org.panel.SignUp.prototype.choosePlan_ = function(plan) {
    goog.dom.forms.setValue(this.planType, plan);
    goog.object.forEach(this.productButtons_, function(button, key) {
        console.debug(key, plan, key === plan);
        if (key === plan) {
            goog.dom.classes.add(button.getElement(),
                'goog-css3-button-checked');
        } else {
            goog.dom.classes.remove(button.getElement(),
                'goog-css3-button-checked');
        }
    }, this);

    if (plan !== 'free') {
        this.makeCCardFieldsRequired(true);
        goog.style.setElementShown(this.ccardEl, true);

    } else {
        this.makeCCardFieldsRequired(false);
        goog.style.setElementShown(this.ccardEl, false);
    }

};

app.org.panel.SignUp.prototype.submitSignUp = function() {
    this.checkCreditCardNumberValidity();
    this.checkValidation();
    var form = this.getForm();
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

/**
 * Internally check validity of the credit card number.
 * @return {!boolean}
 */
app.org.panel.SignUp.prototype.checkCreditCardNumberValidity = function() {
    var billPlan = document.getElementById('billPlan');
    var cardType = document.getElementById('crdType');
    var cardNumber = document.getElementById('crdNumber');

    if (billPlan && billPlan.value !== 'free') {
        if (cardType && cardType.value === 'none') {
            cardType.setCustomValidity('Please select a card type');
            return false;
        } else {
            cardType.setCustomValidity('');
            if (cardType && cardNumber) {
                var number = cardNumber.value;
                var type = cardType.value;
                var isValid = bad.utils.creditCardValidator(number, type);
                if (!isValid) {
                    cardNumber.setCustomValidity(
                        'This is not a valid card number');
                    return false;
                } else {
                    cardNumber.setCustomValidity('');
                    return true;
                }
            }
        }
    }
    return true;
};

/**
 * @param {string} queryData
 * @param {goog.events.EventLike} e Event object.
 */
app.org.panel.SignUp.prototype.onSubmitSignUp = function(queryData, e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    this.clearAlerts();
    if (xhr.isSuccess()) {
        var orgId = data['data']['_id'];
        this.dispatchActionEvent(app.org.EventType.UPDATE_SUCCESS, {id: orgId});
    } else {
        this.displayErrors(data);
    }
};

app.org.panel.SignUp.prototype.makeCCardFieldsRequired = function(bool) {
    var fields = ['crdName', 'crdType', 'crdNumber', 'crdExpDate', 'crdCvv'];
    if (bool) {
        goog.array.forEach(fields, function(id) {
            var field = this.dom_.getElement(id);
            field.setAttribute('required', 'required');
        }, this);
    } else {
       goog.array.forEach(fields, function(id) {
            var field = this.dom_.getElement(id);
            field.removeAttribute('required');
        }, this);
    }
};

app.org.panel.SignUp.prototype.onCancel = function() {
    this.clearAlerts();
    this.dispatchActionEvent(app.org.EventType.CANCEL);
};


