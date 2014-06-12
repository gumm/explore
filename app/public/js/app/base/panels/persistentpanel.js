goog.provide('app.base.panel.Persistent');

goog.require('app.user.EventType');
goog.require('app.base.EventType');
goog.require('app.user.EventType');
goog.require('bad.ui.MenuFloatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('goog.dom');
goog.require('goog.ui.Css3MenuButtonRenderer');
goog.require('goog.ui.MenuButton');

/**
 * The basic login form controller.
 * @param {bad.MqttWsIo} mqtt The mqtt controller object.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Persistent = function(mqtt, opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);

  /**
   * @type {bad.MqttWsIo}
   */
  this.mqtt = mqtt;
};
goog.inherits(app.base.panel.Persistent, bad.ui.Panel);

app.base.panel.Persistent.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  this.initDom();
  this.initMqtt();

  if (this.user_) {
    this.getHandler().listen(
      this.user_,
      app.user.EventType.USER_CHANGED,
      this.userChanged
    );
  }

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
  this.mqtt.mqttSubscribe('#');
};

app.base.panel.Persistent.prototype.buildUserButton = function() {

  /**
   * @type {Array}
   */
  var menuItems = [
    ['Profile', 'icon-user', goog.bind(this.dispatchActionEvent,
      this, app.base.EventType.EDIT_PROFILE)],
    ['Organizations', 'icon-building', goog.bind(this.dispatchActionEvent,
      this, app.user.EventType.VIEW_ORG)],
    [/* menu separator */],
    ['Sign Out', 'icon-signout', goog.bind(this.getUser().logOut, this)]
  ];

  /**
   * @type {bad.ui.MenuFloatRenderer}
   */
  var renderer = bad.ui.MenuFloatRenderer.getInstance();

  /**
   * @type {bad.ui.MenuItemRenderer}
   */
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

app.base.panel.Persistent.prototype.userChanged = function() {
  var salutation = this.getUser().getSalutation();
  if (this.userButton) {
    var icon = goog.dom.createDom('i', 'icon-cog');
    this.userButton.setContent([icon, salutation]);
  }
};

