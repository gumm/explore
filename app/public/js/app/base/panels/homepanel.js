goog.provide('app.base.panel.Home');

goog.require('bad.ui.Panel');

/**
 * The home panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Home = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.Home, bad.ui.Panel);

/**
 * @param {bad.MqttWsIo} mqtt
 */
app.base.panel.Home.prototype.setMqtt = function(mqtt) {
  this.mqtt = mqtt;
};
