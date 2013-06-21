goog.provide('app.user.HomePanel');

goog.require('bad.ui.Panel');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');

/**
 * The basic login form controller.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.user.HomePanel = function(opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);

    /**
     * @type {Object}
     * @private
     */
    this.userData_ = {};
};
goog.inherits(app.user.HomePanel, bad.ui.Panel);

app.user.HomePanel.prototype.enterDocument = function() {

    var menuButton = this.initDom();

    this.getHandler().listen(
        menuButton,
        goog.ui.Component.EventType.ACTION,
        function(e) {
            e.target.getModel().callback();
        }
    ).listen(
        goog.dom.getElement('logout'),
        goog.events.EventType.CLICK,
        this.logOut
    );

    app.user.HomePanel.superClass_.enterDocument.call(this);
};

app.user.HomePanel.prototype.initDom = function() {
    var domHelper = goog.dom.getDomHelper(this.getElement());

    var logOut = goog.bind(this.logOut, this);
    var editProfile = goog.bind(this.dispatchComponentEvent, this,
        'edit-account'
    );
    var menu = new goog.ui.Menu(domHelper);
    menu.addChild(
        new goog.ui.MenuItem('Edit Profile',
            {callback: editProfile},
            domHelper), true);
    menu.addChild(
        new goog.ui.MenuSeparator(domHelper), true);
    menu.addChild(
        new goog.ui.MenuItem('Log Out', {callback: logOut}, domHelper), true);

    var menuButton = goog.ui.decorate(goog.dom.getElement('user_button'));
    menuButton.setMenu(menu);
    return menuButton;
};

app.user.HomePanel.prototype.setUserData = function(data) {
    this.userData_ = data;
    console.debug('Home page received', this.userData_);
};

app.user.HomePanel.prototype.logOut = function() {
    var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
    this.xMan.post(this.uri_, queryData, goog.bind(this.onLogOut, this));
};

app.user.HomePanel.prototype.onLogOut = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        window.open('/', '_self');
    } else {
        console.debug('Log Out was not successful. Try again...', e, xhr);
    }
};
