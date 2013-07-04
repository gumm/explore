goog.provide('app.base.LoginView');

goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.LoginView = function() {
    bad.ui.View.call(this);
};
goog.inherits(app.base.LoginView, bad.ui.View);

app.base.LoginView.prototype.configurePanels = function() {
    var layout = this.getLayout();

    // Intro Panel
    this.introPanel = new bad.ui.Panel();
    this.introPanel.setUri(new goog.Uri('/intro'));
    this.introPanel.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('INTRO', this.introPanel);

    // Login Form
    this.loginPanel = new app.user.LoginForm('login-form');
    this.loginPanel.setUri(new goog.Uri('/login'));
    this.loginPanel.setNestAsTarget(layout.getNest('main', 'right', 'mid'));
    this.addPanelToView('LOGIN-FORM', this.loginPanel);

    // Signup Form
    this.signUpForm = new app.user.SignUpForm('account-form');
    this.signUpForm.setUri(new goog.Uri('/signup'));
    this.signUpForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('SIGNUP-FORM', this.signUpForm);

    // Lost Password Form
    this.lostPwForm = new app.user.LostPasswordForm('get-credentials-form');
    this.lostPwForm.setUri(new goog.Uri('/lost-password'));
    this.lostPwForm.setNestAsTarget(layout.getNest('main', 'center'));
    this.addPanelToView('LOST-PASSWORD-FORM', this.lostPwForm);
};

app.base.LoginView.prototype.displayPanels = function() {
    this.introPanel.renderWithTemplate();
    this.loginPanel.renderWithTemplate();
};

app.base.LoginView.prototype.onPanelAction = function(e) {

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

app.base.LoginView.prototype.showSignUpButton_ = function() {
    goog.dom.classes.remove(this.signUp, 'hide');
};

app.base.LoginView.prototype.hideSignUpButton_ = function() {
    goog.dom.classes.add(this.signUp, 'hide');
};

//-------------------------------------------------------------[ Log-In Form ]--
app.base.LoginView.prototype.slideLoginIn = function() {
    var size = 350;
    var nest = this.getLayout().getNest('main', 'right');
    nest.slideOpen(null, size,
        goog.bind(this.showSignUpButton_, this)
    );
};

/**
 * @param {Function=} opt_callback
 */
app.base.LoginView.prototype.slideLoginOut = function(opt_callback) {
    var nest = this.getLayout().getNest('main', 'right');

    this.hideSignUpButton_();
    var callback = goog.bind(nest.hide, nest, opt_callback);
    nest.slideClosed(callback);
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.base.LoginView.prototype.enterSignUpForm = function() {
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

app.base.LoginView.prototype.exitSignUpForm = function() {
    this.signUpForm.hide();
    this.introPanel.show();
    this.slideLoginIn();
};

//------------------------------------------------------[ Lost Password Form ]--

app.base.LoginView.prototype.enterLostPasswordForm = function() {
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

app.base.LoginView.prototype.exitLostPasswordForm = function() {
    this.lostPwForm.hide();
    this.introPanel.show();
    this.slideLoginIn();
};

//---------------------------------------------------------------[ Home Page ]--

app.base.LoginView.prototype.fetchHomePage = function(data) {
    var callback = goog.bind(function() {
        this.dispatchEvent({type: 'login-success', data: data});
    }, this);
    this.slideLoginOut(callback);
};
