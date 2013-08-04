goog.provide('app.base.HomeView');

goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.HomeView = function(mqtt) {
    this.mqtt = mqtt;
    bad.ui.View.call(this);
};
goog.inherits(app.base.HomeView, bad.ui.View);

app.base.HomeView.prototype.configurePanels = function() {
    var layout = this.getLayout();

    this.homePanel = new app.user.HomePanel(this.mqtt);
    this.homePanel.setUri(new goog.Uri('/home'));
    this.homePanel.setUser(this.getUser());
    this.homePanel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('HOME', this.homePanel);
};

app.base.HomeView.prototype.displayPanels = function() {
    this.homePanel.renderWithTemplate();
};

app.base.HomeView.prototype.onPanelAction = function(e) {

    var panel = e.target;
    var value = e.getValue();
    var data = e.getData();

    switch (value) {
        case 'have-user-container':
        case 'have-mqtt-container':
            goog.dom.appendChild(
                this.getLayout().getNestElement('header'), data);
            break;
        case 'edit-account':
            this.enterSignUpForm();
            break;
        case 'edit-password':
            this.enterPassEditForm();
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

app.base.HomeView.prototype.enterSignUpForm = function() {
    this.editForm = new app.user.SignUpForm('account-form');
    this.editForm.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.editForm.setUri(new goog.Uri('/profile/edit'));
    this.addPanelToView('EDIT_PROFILE', this.editForm);
    this.editForm.renderWithTemplate();
    this.homePanel.hide();
};

app.base.HomeView.prototype.enterPassEditForm = function() {
    this.editForm = new app.user.SignUpForm('account-form');
    this.editForm.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.editForm.setUri(new goog.Uri('/password/edit'));
    this.addPanelToView('EDIT_PROFILE', this.editForm);
    this.editForm.renderWithTemplate();
    this.homePanel.hide();
};

app.base.HomeView.prototype.exitSignUpForm = function() {
    if (this.editForm) {
        this.editForm.dispose();
    }
    this.homePanel.show();
};

app.base.HomeView.prototype.updateUserDisplay = function(data) {
    var salutation = data.reply['data']['name'];
    if (data.reply['data']['surname']) {
        salutation = salutation + ' ' + data.reply['data']['surname'];
    }
    this.homePanel.updateUserButtonCaption(salutation);
    this.exitSignUpForm();
};
