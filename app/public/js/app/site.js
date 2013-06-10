/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Site');

goog.require('bad.ui.Component');
goog.require('bad.ui.Layout');
goog.require('goog.dom.forms');
goog.require('goog.events.EventHandler');
goog.require('goog.net.XhrIo');
goog.require('goog.Uri');

/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 * @param {bad.Net} xManWrapper This site's XhrManager wrapped in a bad.Net
 *      convenience wrapper.
 *
 * @constructor
 * @extends {goog.events.EventHandler}
 */
app.Site = function(xManWrapper) {
    goog.events.EventHandler.call(this, this);

    /**
     * @type {bad.Net}
     */
    this.xMan = xManWrapper;

    /**
     * @type {?bad.ui.Layout}
     * @private
     */
    this.layout_ = null;
};
goog.inherits(app.Site, goog.events.EventHandler);


/**
 * Home page and landing page after login.
 */
app.Site.prototype.initSite = function() {
    this.initLayout_();
};

/**
 * Create the layout component.
 * @private
 */
app.Site.prototype.initLayout_ = function() {

    var id = Math.floor(Math.random() * 2147483648).toString(36);
    var mainCells = ['header', 'main', 'footer'];
    var innerCellsHorizontal = ['left', 'center', 'right'];
    var innerCellsVertical = ['top', 'mid', 'bottom'];
    var topMargin = 0;
    var rightMargin = 0;
    var bottomMargin = 0;
    var leftMargin = 0;

    /**
     * Create a new layout
     * @type {bad.ui.Layout}
     * @private
     */
    this.layout_ = new bad.ui.Layout(id, mainCells,
        bad.ui.Layout.Orientation.VERTICAL
    );

    // Set the defaults for the site.
    this.layout_.setTarget(goog.dom.getDocument().body);
    this.layout_.setInitialSize(mainCells[0], 41);
    this.layout_.setInitialSize(mainCells[2], 23);
    this.layout_.setDraggerThickness(0);
    this.layout_.setWidthToViewport(true);
    this.layout_.setHeightToViewport(true);
    this.layout_.setMargin(topMargin, rightMargin, bottomMargin, leftMargin);

    // Create main horizontal layout.
    var mainHorizontalLayout = this.layout_.setInnerLayout(
        innerCellsHorizontal,
        mainCells[1],
        bad.ui.Layout.Orientation.HORIZONTAL
    );
    mainHorizontalLayout.setDraggerThickness(5);
    mainHorizontalLayout.setInitialSize(innerCellsHorizontal[0], 220);
    mainHorizontalLayout.setInitialSize(innerCellsHorizontal[2], 220);

    // Up-Down Layout in the left.
    var leftVerticalLayout = mainHorizontalLayout.setInnerLayout(
        innerCellsVertical,
        innerCellsHorizontal[0],
        bad.ui.Layout.Orientation.VERTICAL
    );
    leftVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
    leftVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

    // Up-Down Layout in the right.
    var rightVerticalLayout = mainHorizontalLayout.setInnerLayout(
        innerCellsVertical,
        innerCellsHorizontal[2],
        bad.ui.Layout.Orientation.VERTICAL
    );
    rightVerticalLayout.setInitialSize(innerCellsVertical[0], 50);
    rightVerticalLayout.setInitialSize(innerCellsVertical[2], 50);

    this.listen(
        this.layout_,
        bad.ui.Layout.EventType.LAYOUT_READY,
        function(e) {
            if (e.target.getId() === id) {
                this.hideAllNests();
                this.initNavigation();
            }
        }
    );

    // Create the layout in the DOM
    this.layout_.render();
};

app.Site.prototype.getLayout = function() {
    return this.layout_;
};

app.Site.prototype.initNavigation = function() {
    this.fetchIntro();
    this.fetchLoginForm();
};

//-------------------------------------------------------------------[ Intro ]--

app.Site.prototype.fetchIntro = function() {
    var uri = new goog.Uri('/intro');
    this.xMan.get(uri, goog.bind(this.onIntroReceived, this));
};

app.Site.prototype.onIntroReceived = function(e) {
    var xhr = e.target;
    var html = goog.dom.htmlToDocumentFragment(xhr.getResponseText());
    var element = this.layout_.getNestElement('main', 'center');

    // This is not right. It could remove layout elements.
    goog.dom.removeChildren(element);
    goog.dom.append(/** @type {!Node} */ (element), html);
};

//--------------------------------------------------------------[ Login Form ]--

app.Site.prototype.fetchLoginForm = function() {
    var uri = new goog.Uri('/login');
    this.xMan.get(uri, goog.bind(this.onLoginFormReceived, this));
};

app.Site.prototype.onLoginFormReceived = function(e) {
    var xhr = e.target;
    var html = goog.dom.htmlToDocumentFragment(xhr.getResponseText());
    var element = this.layout_.getNestElement('main', 'right', 'mid');

    // This is not right. It could remove layout elements.
    goog.dom.removeChildren(element);
    goog.dom.append(/** @type {!Node} */ (element), html);

    this.listen(
        goog.dom.getElement('create-account'),
        goog.events.EventType.CLICK,
        this.fetchSighUpForm
    ).listen(
        goog.dom.getElement('forgot-password'),
        goog.events.EventType.CLICK,
        this.fetchLostPasswordForm
    ).listen(
        goog.dom.getElement('btn-login'),
        goog.events.EventType.CLICK,
        this.submitLoginForm
    );
    this.slideSignUpIn();
};

app.Site.prototype.submitLoginForm = function() {

    var form = this.getSterileFormFromId_('login-form');
    if (form.checkValidity()) {
        this.logIn_(this.getPostContentFromForm(form));
    }
};

app.Site.prototype.logIn_ = function(credential) {
    var uri = new goog.Uri('/login');
    this.xMan.post(
        uri,
        credential,
        goog.bind(this.onSubmitLoginForm, this)
    );
};

app.Site.prototype.onSubmitLoginForm = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        this.fetchHomePage();
    } else {
        console.debug('Submit was not successful. Try again...', e, xhr);
    }
};

//------------------------------------------------------------[ Sign-Up Form ]--

app.Site.prototype.fetchSighUpForm = function() {
    var uri = new goog.Uri('/signup');
    this.xMan.get(uri, goog.bind(this.onSighUpFormReceived, this));
};

app.Site.prototype.onSighUpFormReceived = function(e) {
    var xhr = e.target;
    var html = goog.dom.htmlToDocumentFragment(xhr.getResponseText());
    var element = this.layout_.getNestElement('main', 'center');

    // This is not right. It could remove layout elements.
    goog.dom.removeChildren(element);
    goog.dom.append(/** @type {!Node} */ (element), html);
    this.listen(
        goog.dom.getElement('account-cancel'),
        goog.events.EventType.CLICK,
        function() {
            this.fetchIntro();
            this.slideSignUpIn();

        }
    ).listen(
        goog.dom.getElement('account-submit'),
        goog.events.EventType.CLICK,
        this.submitSignUp
    );
    this.slideSignUpOut();
};

app.Site.prototype.submitSignUp = function() {
    var uri = new goog.Uri('/signup');
    var form = this.getSterileFormFromId_('account-form');
    var constraintsValidate = form.checkValidity();
    var countryList = goog.dom.forms.getValueByName(form, 'country');

    if (constraintsValidate && countryList !== 'Please select a country') {
        var content = goog.dom.forms.getFormDataMap(form).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            uri,
            queryData,
            goog.bind(this.onSubmitSignUp, this, queryData)
        );
    }
};

app.Site.prototype.onSubmitSignUp = function(queryData, e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        console.debug('HERE IS THE CONTENT IN THE CALLBACK', queryData);
        this.logIn_(queryData);
    } else {
        console.debug('Submit was not successful. Try again...', e, xhr);
    }
};

//------------------------------------------------------[ Lost Password Form ]--

app.Site.prototype.fetchLostPasswordForm = function() {
    var uri = new goog.Uri('/lost-password');
    this.xMan.get(uri, goog.bind(this.onLostPasswordFormReceived, this));
};

app.Site.prototype.onLostPasswordFormReceived = function(e) {
    var xhr = e.target;
    var html = goog.dom.htmlToDocumentFragment(xhr.getResponseText());
    var element = this.layout_.getNestElement('main', 'center');

    // This is not right. It could remove layout elements.
    goog.dom.removeChildren(element);

    goog.dom.append(/** @type {!Node} */ (element), html);

    this.listen(
        goog.dom.getElement('cancel'),
        goog.events.EventType.CLICK,
        function() {
            this.fetchIntro();
            this.slideSignUpIn();
        }
    ).listen(
        goog.dom.getElement('submit'),
        goog.events.EventType.CLICK,
        this.submitLostPasswordForm
    );
    this.slideSignUpOut();
};


app.Site.prototype.submitLostPasswordForm = function() {
    var uri = new goog.Uri('/lost-password');
    var form = this.getSterileFormFromId_('get-credentials-form');
    var constraintsValidate = form.checkValidity();
    if (constraintsValidate) {
        var content = goog.dom.forms.getFormDataMap(form).toObject();
        var queryData = goog.uri.utils.buildQueryDataFromMap(content);
        this.xMan.post(
            uri,
            queryData,
            goog.bind(this.onSubmitLostPasswordForm, this)
        );
    }
};

app.Site.prototype.onSubmitLostPasswordForm = function(e) {
    var xhr = e.target;
    var alert = goog.dom.getElementByClass('alert');
    goog.dom.removeChildren(alert);
    goog.dom.classes.remove(alert, 'alert-success', 'alert-error');
    var message = goog.dom.createDom('strong', {}, 'Done. ');
    if (xhr.isSuccess()) {
        goog.dom.append(alert, message,
            'Check your email on how to reset your password.');
        goog.dom.classes.add(alert, 'alert-success');
        goog.dom.classes.remove(alert, 'hide');
    } else {
        message = goog.dom.createDom('strong', {}, 'Error! ');
        goog.dom.append(alert, message,
            'Please enter a valid email address.');
        goog.dom.classes.add(alert, 'alert-error');
        goog.dom.classes.remove(alert, 'hide');
    }
};

//---------------------------------------------------------------[ Home Page ]--

app.Site.prototype.fetchHomePage = function() {
    var uri = new goog.Uri('/home');
    this.xMan.get(uri, goog.bind(this.onHomePageReceived, this));
};

app.Site.prototype.onHomePageReceived = function(e) {
    var xhr = e.target;
    var html = goog.dom.htmlToDocumentFragment(xhr.getResponseText());
    var element = this.layout_.getNestElement('main', 'center');

    // This is not right. It could remove layout elements.
    goog.dom.removeChildren(element);
    goog.dom.append(/** @type {!Node} */ (element), html);

    this.slideSignUpOut();
    this.listen(
        goog.dom.getElement('btn-logout'),
        goog.events.EventType.CLICK,
        this.logOut
    );
};

app.Site.prototype.logOut = function() {
    var uri = new goog.Uri('/home');
    var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
    this.xMan.post(uri, queryData, goog.bind(this.onLogOut, this));
};

app.Site.prototype.onLogOut = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        window.open('/', '_self');
    } else {
        console.debug('Log Out was not successful. Try again...', e, xhr);
    }
};

//-----------------------------------------------------[ Utility Stuff Below ]--

/**
 * Given a form id, get the form, and intercept and sterilise its submit.
 * Forms that passed through here will not be able to be submitted with a
 * normal submit button any more, but built in HTML5 Constraint Validation
 * will still function on the form. This way, we can still have a button with
 * type="submit", which will trigger the validation, and we can submit
 * valid forms with xhrio which allows us to add callbacks to them.
 *
 * @param {string} string The id of the form we want to sterilise
 * @returns {HTMLFormElement}
 * @private
 */
app.Site.prototype.getSterileFormFromId_ = function(string) {
    var form = /** @type {HTMLFormElement} */ (goog.dom.getElement(string));
    if (form) {
        this.listen(form, goog.events.EventType.SUBMIT, function(e) {
            e.preventDefault();
        });
    }
    return form;
};

/**
 * Given a form, get the post content string.
 * @param form
 * @returns {string}
 */
app.Site.prototype.getPostContentFromForm = function(form) {
    return goog.uri.utils.buildQueryDataFromMap(
        goog.dom.forms.getFormDataMap(form).toObject()
    );
};


app.Site.prototype.hideAllNests = function() {
    var nests = [
        this.layout_.getNest('main', 'left'),
        this.layout_.getNest('main', 'left', 'top'),
        this.layout_.getNest('main', 'left', 'bottom'),
        this.layout_.getNest('main', 'right'),
        this.layout_.getNest('main', 'right', 'top'),
        this.layout_.getNest('main', 'right', 'bottom')
    ];
    goog.array.forEach(nests, function(nest) {
        nest.hide();
    }, this);
};

app.Site.prototype.slideSignUpIn = function() {
    var nest = this.layout_.getNest('main', 'right');
    nest.slideOpen(null, 350, goog.bind(this.showSignUp, this));
};

app.Site.prototype.slideSignUpOut = function() {
    var nest = this.layout_.getNest('main', 'right');
    var hideSignup = goog.bind(this.hideSignUp, this);
    nest.slideClosed(goog.bind(nest.hide, nest, hideSignup));
};

app.Site.prototype.showSignUp = function() {
    var topFix = goog.dom.getElement('signup');
    goog.dom.classes.remove(topFix, 'hide');
};

app.Site.prototype.hideSignUp = function() {
    var topFix = goog.dom.getElement('signup');
    goog.dom.classes.add(topFix, 'hide');
};

app.Site.prototype.slideHideAllNests = function() {
    goog.object.forEach(this.getLayout().getNests(), function(nest) {
        this.slideHideNest(nest);
    }, this);
};

app.Site.prototype.slideOpenAllNests = function() {
    goog.object.forEach(this.getLayout().getNests(), function(nest) {
        this.slideOpenNest(nest);
    }, this);
};

/**
* @param {Object} nest
*/
app.Site.prototype.slideOpenNest = function(nest) {
    if (nest.slideOpen) {
        nest.slideOpen();
    }
};

/**
* @param {Object} nest
*/
app.Site.prototype.slideHideNest = function(nest) {
    if (nest.slideClosed) {
        nest.slideClosed(function() {
            nest.hide();
        });
    }
};

/**
* @param {Object} nest
*/
app.Site.prototype.hideNest = function(nest) {
    if (nest.hide) {
        nest.hide();
    }
};

/**
* @param {number=} op_perCent
* @param {number=} opt_pixels
* @param {Function=} opt_callback
*/
app.Site.prototype.openLeft = function(op_perCent, opt_pixels, opt_callback) {
    this.getLayout().getNest('main', 'left').slideOpen(
        op_perCent, opt_pixels, opt_callback);
};

/**
* @param {number=} op_perCent
* @param {number=} opt_pixels
* @param {Function=} opt_callback
*/
app.Site.prototype.openRight = function(op_perCent, opt_pixels, opt_callback) {
    this.getLayout().getNest('main', 'right').slideOpen(
        op_perCent, opt_pixels, opt_callback);
};

app.Site.prototype.closeLeft = function() {
    this.slideHideNest(this.getLayout().getNest('main', 'left'));
};

app.Site.prototype.closeRight = function() {
    this.slideHideNest(this.getLayout().getNest('main', 'right'));
};
