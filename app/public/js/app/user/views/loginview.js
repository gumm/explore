goog.provide('app.user.view.Login');

goog.require('app.user.panel.Login');
goog.require('app.user.panel.LostPassword');
goog.require('app.user.panel.ResetPassword');
goog.require('app.user.panel.SignUp');
goog.require('bad.ui.Panel');
goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.user.view.Login = function(opt_reset) {
    this.reset = opt_reset;
    bad.ui.View.call(this);
};
goog.inherits(app.user.view.Login, bad.ui.View);

app.user.view.Login.prototype.configurePanels = function() {
    var layout = this.getLayout();

    // Intro Panel
    this.introPanel = new bad.ui.Panel();
    this.introPanel.setUri(new goog.Uri('/intro'));
    this.introPanel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('INTRO', this.introPanel);

    // Login Form
    this.loginPanel = new app.user.panel.Login('login-form');
    this.loginPanel.setUri(new goog.Uri('/login'));
    this.loginPanel.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
    this.addPanelToView('LOGIN-FORM', this.loginPanel);

    // Signup Form
    this.signUpForm = new app.user.panel.SignUp('account-form');
    this.signUpForm.setUri(new goog.Uri('/signup'));
    this.signUpForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('SIGNUP-FORM', this.signUpForm);

    // Lost Password Form
    this.lostPwForm = new app.user.panel.LostPassword('get-credentials-form');
    this.lostPwForm.setUri(new goog.Uri('/lost-password'));
    this.lostPwForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('LOST-PASSWORD-FORM', this.lostPwForm);

    // A reset password form
    this.resetPasswordForm = new app.user.panel.ResetPassword('account-form');
    this.resetPasswordForm.setUri(new goog.Uri('/reset-password'));
    this.resetPasswordForm.setNestAsTarget(
        this.getLayout().getNest('main', 'center'));
    this.addPanelToView('RESET-PASS-FORM', this.resetPasswordForm);
};

app.user.view.Login.prototype.displayPanels = function() {
    if (this.reset) {
        this.resetPasswordForm.render();
    } else {
        this.introPanel.renderWithTemplate();
        this.loginPanel.renderWithTemplate();
    }
};

app.user.view.Login.prototype.onPanelAction = function(e) {

    var panel = e.target;
    var value = e.getValue();
    var data = e.getData();

    switch (value) {
        case bad.ui.EventType.PANEL_READY:
            if (panel === this.loginPanel) {
                this.slideLoginIn();
            }
            break;
        case 'sign-up':
            this.enterSignUpForm();
            break;
        case 'forgot-password':
            this.enterLostPasswordForm();
            break;
        case 'login-success':
            this.fetchHomePage(data);
            break;
        case 'account-cancel':
            this.exitSignUpForm();
            break;
        case 'signup-success':
            this.loginPanel.logIn(data.query);
            break;
        case 'cancel':
            this.exitLostPasswordForm();
            break;
        case 'have-sign-up':
            this.signUp = data;
            goog.dom.appendChild(
                this.getLayout().getNestElement('header'), this.signUp);
            break;
        default:
            console.log('View does not understand action:', value);
    }
};

//-----------------------------------------------------------------[ Sign-Up ]--

app.user.view.Login.prototype.showSignUpButton_ = function() {
    if (this.signUp) {
        goog.dom.classes.remove(this.signUp, 'hide');
    }
};

app.user.view.Login.prototype.hideSignUpButton_ = function() {
    if (this.signUp) {
        goog.dom.classes.add(this.signUp, 'hide');
    }
};

//-------------------------------------------------------------[ Log-In Form ]--
app.user.view.Login.prototype.slideLoginIn = function() {
    var size = 350;
    var nest = this.getLayout().getNest('main', 'right');
    nest.slideOpen(null, size,
        goog.bind(this.showSignUpButton_, this)
    );
};

/**
 * @param {Function=} opt_callback
 */
app.user.view.Login.prototype.slideLoginOut = function(opt_callback) {
    var nest = this.getLayout().getNest('main', 'right');

    this.hideSignUpButton_();
    var callback = goog.bind(nest.hide, nest, opt_callback);
    nest.slideClosed(callback);
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.user.view.Login.prototype.enterSignUpForm = function() {
    if (this.signUpForm.isInDocument()) {
        this.introPanel.hide();
        this.signUpForm.show();
        this.slideLoginOut();
    } else {
        this.signUpForm.renderWithTemplate();
        this.introPanel.hide();
        this.slideLoginOut();
    }
};

app.user.view.Login.prototype.exitSignUpForm = function() {
    this.signUpForm.hide();
    this.introPanel.show();
    this.slideLoginIn();
};

//------------------------------------------------------[ Lost Password Form ]--

app.user.view.Login.prototype.enterLostPasswordForm = function() {
    if (this.lostPwForm.isInDocument()) {
        this.introPanel.hide();
        this.lostPwForm.show();
        this.slideLoginOut();
    } else {
        this.lostPwForm.renderWithTemplate();
        this.introPanel.hide();
        this.slideLoginOut();
    }
};

app.user.view.Login.prototype.exitLostPasswordForm = function() {
    this.lostPwForm.hide();
    this.introPanel.show();
    this.slideLoginIn();
};

//---------------------------------------------------------------[ Home Page ]--

app.user.view.Login.prototype.fetchHomePage = function(data) {
    var callback = goog.bind(function() {
        this.dispatchEvent({type: 'login-success', data: data});
    }, this);
    this.slideLoginOut(callback);
};
