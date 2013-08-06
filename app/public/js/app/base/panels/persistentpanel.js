goog.provide('app.base.panel.Persistent');

goog.require('bad.MqttWsIo');
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
    this.getHandler().listen(
        this.userButton,
        goog.ui.Component.EventType.ACTION,
        function(e) {
            e.target.getModel().callback();
        }
    );
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

    // Item Names & Callbacks
    var menuItems = [
        {
            name: bad.utils.getIconString('Edit our Profile', 'icon-user'),
            action: goog.bind(
                this.dispatchComponentEvent, this,
                app.base.EventType.EDIT_ACCOUNT)
        },
        {
            name: bad.utils.getIconString('Account Settings', 'icon-key'),
            action: goog.bind(
                this.dispatchComponentEvent, this,
                app.base.EventType.EDIT_PW)
        },
        {
            name: bad.utils.getIconString('Organizations', 'icon-group'),
            action: goog.bind(
                this.dispatchComponentEvent, this,
                app.base.EventType.EDIT_ORG)
        },
        {/*Seperator*/},
        {
            name: bad.utils.getIconString('Sign Out', 'icon-signout'),
            action: goog.bind(this.logOut, this)
        }
    ];

    // Menu
    var menu = new goog.ui.Menu(this.dom_);
    goog.array.forEach(menuItems, function(obj) {
        var item;
        if (obj.name) {
            item = new goog.ui.MenuItem(
                obj.name, {callback: obj.action}, this.dom_);
        } else {
            item = new goog.ui.MenuSeparator(this.dom_);
        }
        menu.addChild(item, true);
    }, this);

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
    var uri = new goog.Uri('/logout');
    var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
    this.xMan.post(uri, queryData, goog.bind(this.onLogOut, this));
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.panel.Persistent.prototype.onLogOut = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        window.open('/', '_self');
    } else {
        console.debug('Log Out was not successful. Try again...', e, xhr);
    }
};
