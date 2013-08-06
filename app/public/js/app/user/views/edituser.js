goog.provide('app.user.view.EditUser');

goog.require('app.user.EventType');
goog.require('app.user.panel.DeleteAccount');
goog.require('app.user.panel.SignUp');
goog.require('bad.ui.View');

/**
 * @extends {bad.ui.View}
 * @param {string} target A target action determining the edit forms url.
 * @constructor
 */
app.user.view.EditUser = function(target) {
    this.targetAction_ = target;

    bad.ui.View.call(this);
};
goog.inherits(app.user.view.EditUser, bad.ui.View);

app.user.view.EditUser.prototype.displayPanels = function() {
    this.enterSignUpForm(this.targetAction_);
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.user.view.EditUser.prototype.onPanelAction = function(e) {

    var value = e.getValue();
    var data = e.getData();

    switch (value) {
        case app.user.EventType.SIGNUP_CANCEL:
            this.appDo(app.doMap.VIEW_HOME);
            break;
        case app.user.EventType.SIGNUP_SUCCESS:
            this.appDo(app.doMap.UPDATE_USER, data.reply['data']);
            this.appDo(app.doMap.VIEW_HOME);
            break;
        case app.user.EventType.ACCOUNT_REMOVE_CANCELED:
            this.removeConfirmation();
            break;
        case app.user.EventType.ACCOUNT_REMOVE:
            this.confirmRemoveAccount();
            break;
        default:
            console.log('app.user.view.EditUser No action for: ', value);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

/**
* The sign-up form is used for sign-up, editing accounts, and passwords.
* It is destroyed on exit, and is thus recreated here each time it is called.
* @param {string} value The event value describes the required form.
*/
app.user.view.EditUser.prototype.enterSignUpForm = function(value) {

    var layout = this.getLayout();
    var user = this.getUser();
    var urlString = '/profile/edit';
    if (value === app.base.EventType.EDIT_PW) {
        urlString = '/password/edit';
    }

    this.editForm = new app.user.panel.SignUp('account-form');
    this.editForm.setUri(new goog.Uri(urlString));
    this.editForm.setUser(user);
    this.editForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView(bad.utils.makeId(), this.editForm);
    this.editForm.renderWithTemplate();
    if (this.confirmForm) {
        this.confirmForm.dispose();
    }
};

app.user.view.EditUser.prototype.confirmRemoveAccount = function() {

    var layout = this.getLayout();
    var user = this.getUser();

    this.confirmForm = new app.user.panel.DeleteAccount('confaccdel-form');
    this.confirmForm.setUri(new goog.Uri('/account/delete'));
    this.confirmForm.setUser(user);
    this.confirmForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView(bad.utils.makeId(), this.confirmForm);
    this.confirmForm.renderWithTemplate();
    this.editForm.hide();
};

app.user.view.EditUser.prototype.removeConfirmation = function() {
    if (this.confirmForm) {
        this.confirmForm.dispose();
    }
    this.editForm.show();
};
