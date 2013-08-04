goog.provide('app.base.view.Home');

goog.require('app.base.panel.Home');
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

    this.editForm = new app.user.panel.SignUp('account-form');
    this.editForm.setUri(new goog.Uri('/profile/edit'));
    this.editForm.setUser(user);
    this.editForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('EDIT_PROFILE', this.editForm);
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
            this.enterSignUpForm();
            break;
        case 'account-cancel':
            this.exitSignUpForm();
            break;
        case 'signup-success':
            this.updateUserDisplay(data);
            break;
        default:
            console.log('View does not understand action:', value);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.base.view.Home.prototype.enterSignUpForm = function() {
    this.editForm.renderWithTemplate();
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
