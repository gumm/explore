goog.provide('app.user.panel.SignUp');

goog.require('bad.ui.Form');
goog.require('goog.ui.CustomButton');
goog.require('goog.format.JsonPrettyPrinter');

/**
 * The basic login form controller.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Form}
 * @constructor
 */
app.user.panel.SignUp = function(id, opt_domHelper) {
  bad.ui.Form.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.SignUp, bad.ui.Form);

app.user.panel.SignUp.prototype.initDom = function() {

  bad.utils.makeButton('account-cancel', this,
    goog.bind(this.onCancel, this)
  );

  bad.utils.makeButton('account-submit', this,
    goog.bind(this.submitSignUp, this)
  );

  var removeAccount = goog.dom.getElement('remove-account');
  if (removeAccount) {
    bad.utils.makeButton('remove-account', this,
      goog.bind(this.dispatchActionEvent, this,
        app.user.EventType.ACCOUNT_REMOVE)
    );
  }

  var connectAv = goog.dom.getElement('connect_av');
  if (connectAv) {
    bad.utils.makeButton('connect_av', this,
      goog.bind(this.dispatchActionEvent, this,
        app.user.EventType.CONNECT_AV)
    );
  }

  var avConnected = goog.dom.getElement('av_details');
  if (avConnected) {
    // Populate it with the latest user data:
    console.debug('We have a panel we can add data to:');
    var callback = goog.bind(function(data) {
      goog.dom.setTextContent(avConnected, data);

      var f = new goog.format.JsonPrettyPrinter(
          new goog.format.JsonPrettyPrinter.HtmlDelimiters()
      );
      avConnected.innerHTML = f.format(data);



    }, this);
    this.getUser().updateAVAccount(callback);
  }

};

app.user.panel.SignUp.prototype.onCancel = function() {
  this.clearAlerts();
  this.dispatchActionEvent(app.user.EventType.SIGNUP_CANCEL);
};

app.user.panel.SignUp.prototype.submitSignUp = function() {
  this.checkPasswordMatch();
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
 * Internally check that the passwords match.
 * @return {!boolean}
 */
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
    this.dispatchActionEvent(app.user.EventType.SIGNUP_SUCCESS,
      {query: queryData, reply: data}
    );
  } else {
    this.displayErrors(data);
  }
};
