goog.provide('app.base.panel.Persistent');

goog.require('bad.MqttWsIo');
goog.require('bad.ui.MenuFloatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('bad.ui.Panel');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * The basic login form controller.
 * @param {bad.MqttWsIo} mqtt The mqtt controller object.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Persistent = function(mqtt, opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);

    this.mqtt = mqtt;
};
goog.inherits(app.base.panel.Persistent, bad.ui.Panel);

app.base.panel.Persistent.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();
    this.initMqtt();
    app.base.panel.Persistent.superClass_.enterDocument.call(this);
};

app.base.panel.Persistent.prototype.initDom = function() {
    this.buildUserButton();
};

app.base.panel.Persistent.prototype.initMqtt = function() {
    var mqttEl = document.getElementById('in_mqtt');
    var sysEl = document.getElementById('in_sys');
    this.mqtt.init_(mqttEl, sysEl);
    this.mqtt.trackActiveClients(goog.dom.getElement('active_clients'));
    this.mqtt.trackBytesSent(goog.dom.getElement('bytes_sent'));
    this.mqtt.trackBytesReceived(goog.dom.getElement('bytes_received'));
    this.mqtt.mqttSubscribe('blah');
};

app.base.panel.Persistent.prototype.buildUserButton = function() {

    var menuItems = [
        ['Profile', 'icon-user', goog.bind(this.dispatchActionEvent,
            this, app.base.EventType.EDIT_PROFILE)],
        [/* menu separator */],
        ['Sign Out', 'icon-signout', goog.bind(this.logOut, this)]
    ];

    var renderer = bad.ui.MenuFloatRenderer.getInstance();
    var itemRenderer = bad.ui.MenuItemRenderer.getInstance();
    var menu = bad.utils.makeMenu(
        menuItems, this.dom_, this.getHandler(), this, renderer, itemRenderer);

    // Menu Button
    var menuButton = new goog.ui.MenuButton('', menu,
        new goog.ui.Css3MenuButtonRenderer(), this.dom_
    );
    menuButton.decorate(goog.dom.getElement('user_button'));

    this.userButton = menuButton;
};

/**
 * @param {Object} user
 */
app.base.panel.Persistent.prototype.setUser = function(user) {
    app.base.panel.Persistent.superClass_.setUser.call(this, user);

    var salutation = this.user_['name'];
    if (this.user_['surname']) {
        salutation = salutation + ' ' + this.user_['surname'];
    }

    if (this.userButton) {
        var icon = goog.dom.createDom('i', 'icon-cog');
        this.userButton.setContent([icon, salutation]);
    }
};

app.base.panel.Persistent.prototype.logOut = function() {
    var uri = new goog.Uri(exp.urlMap.LOGOUT);
    var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
    this.xMan.post(uri, queryData, goog.bind(this.onLogOut, this));
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.panel.Persistent.prototype.onLogOut = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        window.open(exp.urlMap.INDEX, '_self');
    } else {
        console.debug('Log Out was not successful. Try again...', e, xhr);
    }
};
