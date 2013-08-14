goog.provide('app.user.view.EditUser');

goog.require('app.org.panel.List');
goog.require('app.user.EventType');
goog.require('app.user.panel.DeleteAccount');
goog.require('app.user.panel.NavPanel');
goog.require('app.user.panel.SignUp');
goog.require('bad.ui.View');

/**
 * @extends {bad.ui.View}
 * @constructor
 */
app.user.view.EditUser = function() {
    bad.ui.View.call(this);
};
goog.inherits(app.user.view.EditUser, bad.ui.View);

app.user.view.EditUser.prototype.configurePanels = function() {
    var layout = this.getLayout();

    /**
     * @type {bad.ui.Panel}
     */
    this.navPanel = new app.user.panel.NavPanel();
    this.navPanel.setNestAsTarget(layout.getNest('main', 'left', 'mid'));
    this.navPanel.setBeforeReadyCallback(goog.bind(this.slideNavIn, this));
    this.addPanelToView(bad.utils.makeId(), this.navPanel);
    this.navPanel.render();
};

app.user.view.EditUser.prototype.displayPanels = function() {
    this.enterLandingView();
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.user.view.EditUser.prototype.onPanelAction = function(e) {

    var value = e.getValue();
    var data = e.getData();
    e.stopPropagation();

    switch (value) {
        case app.user.EventType.SIGNUP_CANCEL:
            this.switchView(goog.bind(this.appDo, this, app.doMap.VIEW_HOME));
            break;
        case app.user.EventType.SIGNUP_SUCCESS:
            this.appDo(app.doMap.UPDATE_USER, data.reply['data']);
            this.switchView(goog.bind(this.appDo, this, app.doMap.VIEW_HOME));
            break;
        case app.user.EventType.ACCOUNT_REMOVE_CANCELED:
            this.switchView(goog.bind(this.appDo, this, app.doMap.VIEW_HOME));
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
        case app.user.EventType.VIEW_ORG:
            this.enterOrgsList();
            break;
        case app.doMap.VIEW_ORG_CREATE:
            this.switchView(goog.bind(this.appDo, this, value));
            break;
        case app.user.EventType.EDIT_ORG:
            this.switchView(goog.bind(this.appDo, this, app.doMap.VIEW_ORG, data.id));
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

    var form = new app.user.panel.SignUp('account-form');
    form.setUri(new goog.Uri(urlString));
    form.setUser(user);
    form.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', form);
    form.renderWithTemplate();
};

/**
* The sign-up form is used for sign-up, editing accounts, and passwords.
* It is destroyed on exit, and is thus recreated here each time it is called.
* @param {string} value The event value describes the required form.
*/
app.user.view.EditUser.prototype.enterOrgsList = function() {

    var layout = this.getLayout();
    var user = this.getUser();

    var panel = new app.org.panel.List();
    panel.setUri(new goog.Uri(exp.urlMap.ORGS.READ));
    panel.setUser(user);
    panel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.user.view.EditUser.prototype.enterLandingView = function() {

    var layout = this.getLayout();
    var user = this.getUser();

    var panel = new bad.ui.Panel();
    panel.setUri(new goog.Uri(exp.urlMap.PROFILE.READ));
    panel.setUser(user);
    panel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.user.view.EditUser.prototype.confirmRemoveAccount = function() {

    var layout = this.getLayout();
    var user = this.getUser();

    var form = new app.user.panel.DeleteAccount('confaccdel-form');
    form.setUri(new goog.Uri(exp.urlMap.ACCOUNTS.DELETE));
    form.setUser(user);
    form.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('replace', form);
    form.renderWithTemplate();
};

app.user.view.EditUser.prototype.slideNavIn = function() {
    var size = 270;
    var slider = this.getLayout().getNest('main', 'left');
    slider.slideOpen(null, size,
        goog.bind(function() {
            console.debug('OK all done - panel in view now.');
        }, this)
    );
};

app.user.view.EditUser.prototype.switchView = function(fn) {
    var nest = this.getLayout().getNest('main', 'left');
    var callback = goog.bind(function(){
        nest.hide();
        fn();
    }, this);
    nest.slideClosed(callback);
};
