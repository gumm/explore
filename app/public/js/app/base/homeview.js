goog.provide('app.base.HomeView');

goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.HomeView = function() {
    bad.ui.View.call(this);
};
goog.inherits(app.base.HomeView, bad.ui.View);

app.base.HomeView.prototype.configurePanels = function() {
    var layout = this.getLayout();

    this.homePanel = new app.user.HomePanel();
    this.homePanel.setUri(new goog.Uri('/home'));
    this.homePanel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('HOME', this.homePanel);

    // Signup Form
    this.accEditForm = new app.user.SignUpForm('account-form');
    this.accEditForm.setUri(new goog.Uri('/account/edit'));
    this.accEditForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('EDIT-ACCOUNT', this.accEditForm);
};

app.base.HomeView.prototype.displayPanels = function() {
    this.homePanel.renderWithTemplate();
};

app.base.HomeView.prototype.onPanelAction = function(e) {

    var panel = e.target;
    var value = e.getValue();
    var data = e.getData();

    switch (value) {
        case 'edit-account':
            this.enterSignUpForm();
            break;
        case 'account-cancel':
            this.exitSignUpForm();
            break;
        case 'signup-success':
            console.debug('Thank user for updated info...');
            break;
        default:
            console.log('View does not understand action:', value);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.base.HomeView.prototype.enterSignUpForm = function() {
    if (this.accEditForm.isInDocument()) {
        this.accEditForm.show();
        this.homePanel.hide();
    } else {
        this.accEditForm.renderWithTemplate();
        this.homePanel.hide();
    }
};

app.base.HomeView.prototype.exitSignUpForm = function() {
    console.debug('Did we come here???');
    this.accEditForm.hide();
    this.homePanel.show();
};
