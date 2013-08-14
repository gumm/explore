goog.provide('app.org.panel.SignUp');

goog.require('bad.ui.Form');
goog.require('goog.ui.CustomButton');

/**
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.org.panel.SignUp = function(id, opt_domHelper) {
    bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.org.panel.SignUp, bad.ui.Form);

app.org.panel.SignUp.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.org.panel.SignUp.superClass_.enterDocument.call(this);
};

app.org.panel.SignUp.prototype.initDom = function() {
        bad.utils.makeButton('create-org',
            goog.bind(this.submitSignUp, this)
        );
        this.gold = bad.utils.makeToggleButton('gold',
            goog.bind(this.choosePlan_, this, 3)
        );
        this.silver = bad.utils.makeToggleButton('silver',
            goog.bind(this.choosePlan_, this, 2)
        );
        this.bronze = bad.utils.makeToggleButton('bronze',
            goog.bind(this.choosePlan_, this, 1)
        );
        this.free = bad.utils.makeToggleButton('free',
            goog.bind(this.choosePlan_, this, 0)
        );
         goog.dom.classes.add(this.free.getElement(),
             'goog-css3-button-checked');

        this.ccardEl = goog.dom.getElement('ccard');
        goog.style.setElementShown(this.ccardEl, false);

        this.planType = goog.dom.getElement('planType');
        goog.dom.forms.setValue(this.planType, 0);
};

app.org.panel.SignUp.prototype.choosePlan_ = function(plan) {
    goog.dom.forms.setValue(this.planType, plan);

    var arr = [this.free, this.bronze, this.silver, this.gold];
    goog.array.forEach(arr, function(button, index) {
        if (index !== plan) {
            goog.dom.classes.remove(button.getElement(),
                'goog-css3-button-checked');
        } else {
            goog.dom.classes.add(button.getElement(),
                'goog-css3-button-checked');
        }
    }, this);

    if(plan) {
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
    var cardType = document.getElementById('ccardtype-tf');
    var cardNumber = document.getElementById('ccardnumber-tf');
    if (cardType && cardNumber) {
        var number = cardNumber.value;
        var type = cardType.value;
        var isValid = bad.utils.creditCardValidator(number, type);
        if (!isValid) {
            cardNumber.setCustomValidity('This is not a valid card number');
            return false;
        } else {
            cardNumber.setCustomValidity('');
            return true;
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
        this.dispatchActionEvent(app.user.EventType.EDIT_ORG, {id:orgId});
    } else {
        this.displayErrors(data);
    }
};

app.org.panel.SignUp.prototype.makeCCardFieldsRequired = function(bool) {
    var cCardFieldIds = ['ccardnumber-tf', 'ccardexpdate-tf', 'ccardcvv-tf'];
    if(bool) {
        goog.array.forEach(cCardFieldIds, function(id) {
            var field = goog.dom.getElement(id);
            field.setAttribute('required', 'required');
        });
    } else {
       goog.array.forEach(cCardFieldIds, function(id) {
            var field = goog.dom.getElement(id);
            field.removeAttribute('required');
        });
    }
};


