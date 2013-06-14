goog.provide('app.base.LoginView');

goog.require('bad.ui.View');

/**
 * @param {!bad.Net} xManWrapper This site's XhrManager wrapped in a bad.Net
 *      convenience wrapper.
 *
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.LoginView = function(xManWrapper) {
    bad.ui.View.call(this, this);


};
goog.inherits(app.base.LoginView, bad.ui.View);

app.base.LoginView.prototype.configurePanels = function() {
    this.addPanelToView('INTRO', new bad.ui.Panel(
        new goog.Uri('/intro'),
        this.layout_.getNest('main', 'center')
    ));

    this.addPanelToView('LOGIN-FORM', new app.user.LoginForm(
        'login-form',
        new goog.Uri('/login'),
        this.layout_.getNest('main', 'right', 'mid'),
        this.layout_.getNest('main', 'right')
    ));

    this.addPanelToView('SIGNUP-FORM', new app.user.SignUpForm(
        'account-form',
        new goog.Uri('/signup'),
        this.layout_.getNest('main', 'center')
    ));

    this.addPanelToView('LOST-PASSWORD-FORM', new app.user.LostPasswordForm(
        'get-credentials-form',
        new goog.Uri('/lost-password'),
        this.layout_.getNest('main', 'center')
    ));
};

app.base.LoginView.prototype.displayPanels = function() {
    var arr = ['INTRO', 'LOGIN-FORM'];
    goog.array.forEach(arr, function(name) {
        this.panelMap[name].renderWithTemplate();
    }, this);
};

app.base.LoginView.prototype.onPanelAction = function(e) {

    var panel = e.target;
    var value = e.getValue();
    var data = e.getData();

    console.debug(panel, value, data);

    switch (value) {
        case bad.ui.EventType.PANEL_READY:
            if (panel.slideIn) {
                panel.slideIn();
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
//            this.loginForm_.logIn(data);
            break;
        case 'cancel':
            this.exitLostPasswordForm();
            break;
        default:
            console.log('View does not understand action:', value);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.base.LoginView.prototype.enterSignUpForm = function() {
    var signUpForm = this.panelMap['SIGNUP-FORM'];
    var loginForm = this.panelMap['LOGIN-FORM'];
    var intro = this.panelMap['INTRO'];
    if (signUpForm.isInDocument()) {
        intro.hide();
        signUpForm.show();
        loginForm.slideOut();
    } else {
        signUpForm.renderWithTemplate();
        intro.hide();
        loginForm.slideOut();
    }
};

app.base.LoginView.prototype.exitSignUpForm = function() {
    var signUpForm = this.panelMap['SIGNUP-FORM'];
    var loginForm = this.panelMap['LOGIN-FORM'];
    var intro = this.panelMap['INTRO'];
    signUpForm.hide();
    intro.show();
    loginForm.slideIn();
};

//------------------------------------------------------[ Lost Password Form ]--

app.base.LoginView.prototype.enterLostPasswordForm = function() {
    var loginForm = this.panelMap['LOGIN-FORM'];
    var intro = this.panelMap['INTRO'];
    var lpwf = this.panelMap['LOST-PASSWORD-FORM'];
    if (lpwf.isInDocument()) {
        intro.hide();
        lpwf.show();
        loginForm.slideOut();
    } else {
        lpwf.renderWithTemplate();
        intro.hide();
        loginForm.slideOut();
    }
};

app.base.LoginView.prototype.exitLostPasswordForm = function() {
    var loginForm = this.panelMap['LOGIN-FORM'];
    var intro = this.panelMap['INTRO'];
    var lpwf = this.panelMap['LOST-PASSWORD-FORM'];
    lpwf.hide();
    intro.show();
    loginForm.slideIn();
};

//---------------------------------------------------------------[ Home Page ]--

app.base.LoginView.prototype.fetchHomePage = function(data) {
    if (!this.homePanel_) {
        this.homePanel_ = new app.user.HomePanel(
            this.xMan_,
            new goog.Uri('/home'),
            this.layout_.getNest('main', 'center')
        );
        this.homePanel_.setUserData(data);
        this.homePanel_.renderWithTemplate();
    } else {
        this.homePanel_.setUserData(data);
        this.introPanel_.dispose();
        this.signUpForm_.dispose();
        this.homePanel_.renderWithTemplate();

        var dispose = goog.bind(this.loginForm_.dispose, this.loginForm_);
        this.loginForm_.slideOut(dispose);
    }
};
