goog.provide('app.user.panel.AvApi');

goog.require('bad.ui.Panel');
goog.require('bad.utils');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.dom.Range');
goog.require('goog.dom.dataset');
goog.require('goog.format.JsonPrettyPrinter');
goog.require('goog.string');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.user.panel.AvApi = function(opt_domHelper) {
  bad.ui.Panel.call(this, opt_domHelper);

  this.jsonFormat_ = new goog.format.JsonPrettyPrinter(
    new goog.format.JsonPrettyPrinter.HtmlDelimiters()
  );
};
goog.inherits(app.user.panel.AvApi, bad.ui.Panel);

app.user.panel.AvApi.prototype.setConsoleElement = function(el) {
  this.consoleEl_ = el;
};

app.user.panel.AvApi.prototype.initDom = function() {

  var dom_ = goog.dom.getDomHelper(this.getElement());

  var buttonEls = goog.dom.getElementsByClass('av_test_button');
  goog.array.forEach(buttonEls, function(el) {
    bad.utils.makeButton(
      el,
      this,
      goog.bind(this.doCall_, this, goog.dom.dataset.get(el, 'url')),
      dom_
    );
  }, this);
};

app.user.panel.AvApi.prototype.replaceAll = function(s, ss, r) {
  var re = new RegExp(goog.string.regExpEscape(ss), 'g');
  return s.replace(re, r);
};

app.user.panel.AvApi.prototype.doCall_ = function(url) {
  console.debug(url);
  var replaceThese = [':uid'];
  goog.array.forEach(replaceThese, function(ss) {
    console.debug(url, ss);
    url = this.replaceAll(url, ss, '%s');
  }, this);

  var range = goog.dom.Range.createFromWindow();
  var selection = range ? range.getText() : null;
  url = goog.string.subs(url, selection);

  this.xMan.get(
      new goog.Uri(url),
      goog.bind(this.printResult, this)
  );
};

app.user.panel.AvApi.prototype.printResult = function(e) {
  var xhr = e.target;
  if (xhr.isSuccess()) {
    var data = xhr.getResponseJson();
    this.consoleEl_.innerHTML = this.jsonFormat_.format(data);
  }
};
