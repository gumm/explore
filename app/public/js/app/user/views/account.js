goog.provide('app.user.view.Account');

goog.require('app.org.panel.List');
goog.require('app.user.EventType');
goog.require('app.user.panel.DeleteAccount');
goog.require('app.user.panel.NavPanel');
goog.require('app.user.panel.SignUp');
goog.require('bad.ui.View');

/**
 * @param {string=} opt_landing Optional panel to land on.
 * @extends {bad.ui.View}
 * @constructor
 */
app.user.view.Account = function(opt_landing) {
    bad.ui.View.call(this);

    this.landing_ = opt_landing || null;
};
goog.inherits(app.user.view.Account, bad.ui.View);

app.user.view.Account.prototype.configurePanels = function() {
    /**
     * @type {bad.ui.Panel}
     */
    this.nav = new app.user.panel.NavPanel();
    this.nav.setUser(this.getUser());
    this.nav.setNestAsTarget(this.getLayout().getNest('main', 'left', 'mid'));
    this.nav.setBeforeReadyCallback(goog.bind(this.slideNavIn, this));
    this.addPanelToView(bad.utils.makeId(), this.nav);
    this.nav.render();
};

app.user.view.Account.prototype.displayPanels = function() {

    switch(this.landing_) {
        case 'orgList':
            this.enterOrgsList();
            break;
        default:
            this.enterOverview(this.landing_);
    }
};

/**
 * @param {bad.ActionEvent} e Event object.
 */
app.user.view.Account.prototype.onPanelAction = function(e) {

    var value = e.getValue();
    var data = e.getData();
    e.stopPropagation();

    switch (value) {
        case app.user.EventType.SIGNUP_CANCEL:
            this.enterOverview();
            break;
        case app.user.EventType.SIGNUP_SUCCESS:
            this.appDo(app.doMap.UPDATE_USER, data.reply['data']);
            this.switchView(goog.bind(this.appDo, this, app.doMap.VIEW_HOME));
            break;
        case app.user.EventType.ACCOUNT_REMOVE_CANCELED:
            this.enterOverview();
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
        case app.user.EventType.CANCEL_VIEW_ORG:
            this.enterOverview();
            break;
        case app.doMap.VIEW_ORG_CREATE:
            this.switchView(goog.bind(this.appDo, this, value));
            break;
        case app.user.EventType.EDIT_ORG:
            this.switchView(
                goog.bind(this.appDo, this, app.doMap.VIEW_ORG, data.id));
            break;
        case app.user.EventType.VIEW_ACCOUNT:
            this.enterOverview();
            break;
        default:
            console.log('app.user.view.Account No action for: ', value);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

/**
* The sign-up form is used for sign-up, editing accounts, and passwords.
* It is destroyed on exit, and is thus recreated here each time it is called.
* @param {string} value The event value describes the required form.
*/
app.user.view.Account.prototype.enterSignUpForm = function(value) {

    var urlString = exp.urlMap.ACCOUNTS.UPDATE;
    if (value === app.user.EventType.EDIT_PW) {
        urlString = exp.urlMap.PW.EDIT;
    }

    /**
     * @type {app.user.panel.SignUp}
     */
    var form = new app.user.panel.SignUp('account-form');
    form.setUri(new goog.Uri(urlString));
    form.setUser(this.getUser());
    form.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.addPanelToView('replace', form);
    form.renderWithTemplate();
};

/**
* The sign-up form is used for sign-up, editing accounts, and passwords.
* It is destroyed on exit, and is thus recreated here each time it is called.
*/
app.user.view.Account.prototype.enterOrgsList = function() {

    /**
     * @type {app.org.panel.List}
     */
    var panel = new app.org.panel.List();
    panel.setUri(new goog.Uri(exp.urlMap.ORGS.READ));
    panel.setUser(this.getUser());
    panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.user.view.Account.prototype.enterOverview = function(opt_id) {

    if (this.nav) {this.nav.resetMenu();}
    var uriString = exp.urlMap.ACCOUNTS.READ;
    if (opt_id) {
        uriString = uriString + '/' + opt_id;
    }


    /**
     * @type {bad.ui.Panel}
     */
    var panel = new bad.ui.Panel();
    panel.setUri(new goog.Uri(uriString));
    panel.setUser(this.getUser());
    panel.setNestAsTarget(this.getLayout().getNest('main', 'center'));
    var beforeReadyCallback = goog.bind(function() {
        var editProfile = goog.dom.getElement('editProfile');
        this.getHandler().listen(
            editProfile,
            goog.events.EventType.CLICK,
            function() {
                this.dispatchActionEvent(app.user.EventType.EDIT_ACCOUNT);
            }, undefined, this
        );
    }, panel);
    panel.setBeforeReadyCallback(beforeReadyCallback);
    this.addPanelToView('replace', panel);
    panel.renderWithTemplate();
};

app.user.view.Account.prototype.confirmRemoveAccount = function() {

    var form = new app.user.panel.DeleteAccount('confaccdel-form');
    form.setUri(new goog.Uri(exp.urlMap.ACCOUNTS.DELETE));
    form.setUser(this.getUser());
    form.setNestAsTarget( this.getLayout().getNest('main', 'center'));
    this.addPanelToView('replace', form);
    form.renderWithTemplate();
};

app.user.view.Account.prototype.slideNavIn = function() {
    var size = 270;
    var slider = this.getLayout().getNest('main', 'left');
    slider.slideOpen(null, size, goog.nullFunction);
};

app.user.view.Account.prototype.switchView = function(fn) {
    var nest = this.getLayout().getNest('main', 'left');
    var callback = goog.bind(function() {
        nest.hide();
        fn();
    }, this);
    nest.slideClosed(callback);
};
