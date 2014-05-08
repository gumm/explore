goog.provide('app.base.panel.Trace');

goog.require('bad.ui.Panel');
goog.require('goog.dom');
goog.require('goog.format.JsonPrettyPrinter');
goog.require('goog.json');


/**
 * The basic login form controller.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.base.panel.Trace = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.base.panel.Trace, bad.ui.Panel);

app.base.panel.Trace.prototype.enterDocument = function() {
  this.dom_ = goog.dom.getDomHelper(this.getElement());
  this.initMqtt();
  app.base.panel.Trace.superClass_.enterDocument.call(this);
};

app.base.panel.Trace.prototype.initMqtt = function() {
  this.mqtt.mqttSubscribe('/header');
  var el = goog.dom.getElementByClass('traceContainer', this.getElement());
  var f = new goog.format.JsonPrettyPrinter(
      new goog.format.JsonPrettyPrinter.HtmlDelimiters());
  this.getHandler().listen(
    this.mqtt,
    '/header',
    function(e) {
      var obj = goog.json.parse(e.payload);
      console.debug(obj);
      el.innerHTML = f.format(obj);
    }
  );
};
