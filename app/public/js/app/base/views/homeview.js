goog.provide('app.base.view.Home');

goog.require('app.base.panel.Home');
goog.require('app.user.panel.DeleteAccount');
goog.require('app.user.panel.SignUp');
goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Home = function(mqtt) {
    this.mqtt = mqtt;
    bad.ui.View.call(this);
};
goog.inherits(app.base.view.Home, bad.ui.View);

app.base.view.Home.prototype.configurePanels = function() {
    var layout = this.getLayout();
    var user = this.getUser();

    this.homePanel = new app.base.panel.Home(this.mqtt);
    this.homePanel.setUri(new goog.Uri('/home'));
    this.homePanel.setUser(user);
    this.homePanel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('HOME', this.homePanel);
};

app.base.view.Home.prototype.displayPanels = function() {
    this.homePanel.renderWithTemplate();
};

app.base.view.Home.prototype.onPanelAction = function(e) {

    var value = e.getValue();
    var data = e.getData();

    switch (value) {
        case 'have-user-container':
        case 'have-mqtt-container':
            goog.dom.appendChild(
                this.getLayout().getNestElement('header'), data);
            break;
        case 'edit-account':
        case 'edit-password':
            this.enterSignUpForm(value);
            break;
        case 'account-cancel':
            this.exitSignUpForm();
            break;
        case 'signup-success':
            this.updateUserDisplay(data);
            break;
        case 'confirm-cancel':
            this.removeConfirmation();
            break;
        case 'remove-account':
            this.confirmRemoveAccount();
            break;
        case 'organizations':
            this.editOrg();
            break;
        default:
            console.log('View does not understand action:', value);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

/**
 * The sign-up form is used for sign-up, editing accounts, and passwords.
 * It is destroyed on exit, and is thus recreated here each time it is called.
 * @param {string} value The event value describes the required form.
 */
app.base.view.Home.prototype.enterSignUpForm = function(value) {

    var layout = this.getLayout();
    var user = this.getUser();
    var urlString = '/profile/edit';
    if(value === 'edit-password') {
        urlString = '/password/edit';
    }

    this.editForm = new app.user.panel.SignUp('account-form');
    this.editForm.setUri(new goog.Uri(urlString));
    this.editForm.setUser(user);
    this.editForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('EDIT_PROFILE', this.editForm);
    this.editForm.renderWithTemplate();
    if(this.confirmForm) {
        this.confirmForm.dispose();
    }
    this.homePanel.hide();
};

app.base.view.Home.prototype.exitSignUpForm = function() {
    if (this.editForm) {
        this.editForm.dispose();
    }
    this.homePanel.show();
};

app.base.view.Home.prototype.updateUserDisplay = function(data) {
    var salutation = data.reply['data']['name'];
    if (data.reply['data']['surname']) {
        salutation = salutation + ' ' + data.reply['data']['surname'];
    }
    this.homePanel.updateUserButtonCaption(salutation);
    this.exitSignUpForm();
};

app.base.view.Home.prototype.confirmRemoveAccount = function() {

    var layout = this.getLayout();
    var user = this.getUser();

    this.confirmForm = new app.user.panel.DeleteAccount('confaccdel-form');
    this.confirmForm.setUri(new goog.Uri('/account/delete'));
    this.confirmForm.setUser(user);
    this.confirmForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('CONFIRM-REMOVAL', this.confirmForm);
    this.confirmForm.renderWithTemplate();

    this.editForm.hide();
    this.homePanel.hide();
};

app.base.view.Home.prototype.removeConfirmation = function() {
    if (this.confirmForm) {
        this.confirmForm.dispose();
    }
    this.editForm.show();
};

app.base.view.Home.prototype.editOrg = function() {
    var layout = this.getLayout();
    var user = this.getUser();

    this.editOrgForm = new app.user.panel.DeleteAccount('confaccdel-form');
    this.editOrgForm.setUri(new goog.Uri('/account/delete'));
    this.editOrgForm.setUser(user);
    this.editOrgForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('EDIT-ORG', this.editOrgForm);
    this.editOrgForm.renderWithTemplate();

    this.editForm.hide();
    this.homePanel.hide();
};