goog.provide('app.user.view.EditUser');

goog.require('app.user.EventType');
goog.require('app.user.panel.DeleteAccount');
goog.require('app.user.panel.NavPanel');
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

app.user.view.EditUser.prototype.configurePanels = function() {
    var layout = this.getLayout();

    /**
     * Header Panel
     * @type {bad.ui.Panel}
     */
    this.navPanel = new app.user.panel.NavPanel();
    this.navPanel.setNestAsTarget(layout.getNest('main', 'left', 'mid'));
    this.navPanel.setBeforeReadyCallback(goog.bind(this.slideNavIn, this));
    this.addPanelToView(bad.utils.makeId(), this.navPanel);
    this.navPanel.render();
};

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
            this.slideNavOut();
            this.appDo(app.doMap.VIEW_HOME);
            break;
        case app.user.EventType.SIGNUP_SUCCESS:
            this.slideNavOut();
            this.appDo(app.doMap.UPDATE_USER, data.reply['data']);
            this.appDo(app.doMap.VIEW_HOME);
            break;
        case app.user.EventType.ACCOUNT_REMOVE_CANCELED:
            this.removeConfirmation();
            break;
        case app.user.EventType.ACCOUNT_REMOVE:
            this.confirmRemoveAccount();
            break;
        case app.user.EventType.EDIT_ACCOUNT:
            this.enterSignUpForm(value);
            break;
        case app.user.EventType.EDIT_PW:
            this.enterSignUpForm(value);
            break;
        case app.user.EventType.EDIT_ORG:
            console.debug('SO HERE WE ARE: A day later and a $ poorer, and ' +
                'still no org func.');
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
    var urlString = exp.urlMap.PROFILE.EDIT;
    if (value === app.user.EventType.EDIT_PW) {
        urlString = exp.urlMap.PW.EDIT;
    }

    this.editForm = new app.user.panel.SignUp('account-form');
    this.editForm.setUri(new goog.Uri(urlString));
    this.editForm.setUser(user);
    this.editForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('editform', this.editForm);
    this.editForm.renderWithTemplate();
    if (this.confirmForm) {
        this.confirmForm.dispose();
    }
};

app.user.view.EditUser.prototype.confirmRemoveAccount = function() {

    var layout = this.getLayout();
    var user = this.getUser();

    this.confirmForm = new app.user.panel.DeleteAccount('confaccdel-form');
    this.confirmForm.setUri(new goog.Uri(exp.urlMap.ACCOUNTS.DELETE));
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

app.user.view.EditUser.prototype.slideNavIn = function() {
    var size = 350;
    var slider = this.getLayout().getNest('main', 'left');
    slider.slideOpen(null, size,
        goog.bind(function() {
            console.debug('OK all done - panel in view now.');
        }, this)
    );
};

app.user.view.EditUser.prototype.slideNavOut = function() {
    var nest = this.getLayout().getNest('main', 'left');
    var callback = goog.bind(nest.hide, nest);
    nest.slideClosed(callback);
};
