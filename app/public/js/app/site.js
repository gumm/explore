/**
 * @fileoverview The top level app. From here the views are controlled.
 */
goog.provide('app.Site');

goog.require('app.base.HomeView');
goog.require('app.base.LoginView');
goog.require('app.user.HomePanel');
goog.require('app.user.LoginForm');
goog.require('app.user.LostPasswordForm');
goog.require('app.user.SignUpForm');
goog.require('bad.ui.EventType');
goog.require('bad.ui.Layout');
goog.require('bad.ui.Panel');

goog.require('goog.Uri');
goog.require('goog.dom.forms');
goog.require('goog.events.EventHandler');
goog.require('goog.net.XhrIo');

/**
 * Constructor of the main site object. Inherits from EventHandler, so it
 * can simply subscribe to events on its children.
 * @param {!bad.Net} xManWrapper This site's XhrManager wrapped in a bad.Net
 *      convenience wrapper.
 * @param {bad.MqttWsIo} mqtt A mqtt web-socket implementation.
 * @constructor
 * @extends {goog.events.EventHandler}
 */
app.Site = function(xManWrapper, mqtt, opt_landing) {
    goog.events.EventHandler.call(this);

    /**
     * @type {!bad.Net}
     */
    this.xMan_ = xManWrapper;

    /**
     * @type {bad.MqttWsIo}
     */
    this.mqtt = mqtt;

    /**
     * @type {bad.ui.Layout}
     * @private
     */
    this.layout_ = null;

    /**
     * @type {Object}
     * @private
     */
    this.user_ = {};

    this.landing = opt_landing ? opt_landing : null;
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
    this.layout_.setInitialSize(mainCells[0], 72);
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

    /**
     * Each if the internal layouts will fire a LAYOUT_READY event, and all
     * of those events bubble to this_layout_. Only when all the internal
     * layouts are ready, does this.layout_ fire its LAYOUT_READY event.
     * So if we just want to react the this.layout_, then we need to
     * check the target id of all events, and simply act when it is the same
     * as this.layout_'s id.
     */
    this.listen(
        this.layout_,
        bad.ui.Layout.EventType.LAYOUT_READY,
        function(e) {
            if (e.target.getId() === id) {
                this.hideAllNests();
                this.land();
            }
        }
    );

    // Create the layout in the DOM
    this.layout_.render();
};

app.Site.prototype.land = function() {

    switch (this.landing) {
        case 'resetpw':
            this.viewLogin(true);
            break;
        default:
            this.autoLogin();
    }
};


//--------------------------------------------------------------[ Auto Login ]--

app.Site.prototype.autoLogin = function() {
    var callback = goog.bind(this.onAutoLoginReply, this);
    this.xMan_.get(new goog.Uri('/auto_login'), callback);
};

app.Site.prototype.onAutoLoginReply = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        var data = xhr.getResponseJson();
        if (data.error) {
            this.viewLogin();
        } else {
            this.onLogin({data: data});
        }
    } else {
        this.viewLogin();
    }
};

//-------------------------------------------------------------------[ Views ]--

/**
 * @param {bad.ui.View} view
 */
app.Site.prototype.switchView = function(view) {
    if (this.activeView_) {
        this.activeView_.dispose();
    }
    this.activeView_ = view;
    this.activeView_.setLayout(this.layout_);
    this.activeView_.setXMan(this.xMan_);
    this.activeView_.setUser(this.user_);
    this.activeView_.render();
};

app.Site.prototype.onLogin = function(e) {
    this.user_ = e.data;
    this.viewHome();
};

/**
 *
 * @param {boolean=} opt_reset
 */
app.Site.prototype.viewLogin = function(opt_reset) {
    /**
     * @type {app.base.LoginView}
     */
    var view = new app.base.LoginView(opt_reset);
    this.listenOnce(
        view,
        'login-success',
        this.onLogin
    );
    this.switchView(view);
};

app.Site.prototype.viewHome = function() {
    /**
     * @type {app.base.HomeView}
     */
    var view = new app.base.HomeView(this.mqtt);
    this.switchView(view);
};

//-----------------------------------------------------[ Utility Stuff Below ]--

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
