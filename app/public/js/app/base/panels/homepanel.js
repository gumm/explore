goog.provide('app.base.panel.Home');

goog.require('bad.MqttWsIo');
goog.require('bad.ui.Panel');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.Menu');
goog.require('goog.ui.MenuButton');
goog.require('goog.ui.MenuItem');
goog.require('goog.ui.MenuSeparator');


/**
 * The basic login form controller.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Home = function(mqtt, opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);

    this.mqtt = mqtt;

    /**
     * @type {Object}
     * @private
     */
    this.userData_ = {};
};
goog.inherits(app.base.panel.Home, bad.ui.Panel);

app.base.panel.Home.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();
    this.getHandler().listen(
        this.userButton,
        goog.ui.Component.EventType.ACTION,
        function(e) {
            e.target.getModel().callback();
        }
    );

    var mqttEl = document.getElementById('in_mqtt');
    var sysEl = document.getElementById('in_sys');
    this.mqtt.init_(mqttEl, sysEl);
    this.mqtt.trackActiveClients(goog.dom.getElement('active_clients'));
    this.mqtt.trackBytesSent(goog.dom.getElement('bytes_sent'));
    this.mqtt.trackBytesReceived(goog.dom.getElement('bytes_received'));

    console.debug('TOPIC: ', this.getUser());
    this.mqtt.mqttSubscribe('blah');

    app.base.panel.Home.superClass_.enterDocument.call(this);
};

app.base.panel.Home.prototype.initDom = function() {
    // Pass the sign-up portion of the dom up to the view to be added
    // elsewhere.
    this.dispatchComponentEvent('have-user-container',
        goog.dom.removeNode(goog.dom.getElement('active_user_container'))
    );

    this.dispatchComponentEvent('have-mqtt-container',
        goog.dom.removeNode(goog.dom.getElement('sysreadout'))
    );

    this.buildUserButton();
};

app.base.panel.Home.prototype.buildUserButton = function() {

    // Item Names & Callbacks
    var menuItems = [
        {
            name: bad.utils.getIconString('Edit Your Profile', 'icon-user'),
            action: goog.bind(
                this.dispatchComponentEvent, this, 'edit-account')
        },
        {
            name: bad.utils.getIconString('Account Settings', 'icon-key'),
            action: goog.bind(
                this.dispatchComponentEvent, this, 'edit-password')
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

app.base.panel.Home.prototype.updateUserButtonCaption = function(caption) {
    var icon = goog.dom.createDom('i', 'icon-cog');
    this.userButton.setContent([icon, caption]);
};

app.base.panel.Home.prototype.logOut = function() {
    var queryData = goog.uri.utils.buildQueryDataFromMap({'logout': true});
    this.xMan.post(this.getUri(), queryData, goog.bind(this.onLogOut, this));
};

app.base.panel.Home.prototype.onLogOut = function(e) {
    var xhr = e.target;
    if (xhr.isSuccess()) {
        window.open('/', '_self');
    } else {
        console.debug('Log Out was not successful. Try again...', e, xhr);
    }
};
