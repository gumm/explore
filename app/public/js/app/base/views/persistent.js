goog.provide('app.base.view.Persistent');

goog.require('app.base.EventType');
goog.require('app.base.panel.Persistent');
goog.require('app.doMap');
goog.require('app.user.EventType');
goog.require('bad.ui.View');
goog.require('bad.utils');
goog.require('goog.Uri');
goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events.EventType');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Persistent = function(mqtt) {
  this.mqtt = mqtt;
  bad.ui.View.call(this);
};
goog.inherits(app.base.view.Persistent, bad.ui.View);

app.base.view.Persistent.prototype.configurePanels = function() {
  var callback = goog.bind(function() {
    this.getHandler().listen(
      goog.dom.getElement('logoImg'),
      goog.events.EventType.CLICK,
      function() {
        this.switchView(goog.bind(
          this.appDo, this, app.doMap.VIEW_HOME));
      }
    );
  }, this);

  var headerPanel = new app.base.panel.Persistent(this.mqtt);
  headerPanel.setUri(new goog.Uri(exp.urlMap.BASIC.HEADER));
  headerPanel.setUser(this.getUser());
  headerPanel.setNestAsTarget(this.getLayout().getNest('header'));
  headerPanel.setBeforeReadyCallback(callback);
  this.addPanelToView(bad.utils.makeId(), headerPanel);
  headerPanel.renderWithTemplate();
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.view.Persistent.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    case app.base.EventType.EDIT_PROFILE:
      this.switchView(goog.bind(
        this.appDo, this, app.doMap.VIEW_EDIT_USER));
      break;
    case app.user.EventType.VIEW_ORG:
      this.switchView(goog.bind(
        this.appDo, this, app.doMap.VIEW_EDIT_USER, 'orgList'));
      break;
    default:
      goog.nullFunction();
//      console.log('app.base.view.Persistent No case for: ', value, data);
  }
};

app.base.view.Persistent.prototype.switchView = function(fn) {
  var layout = this.getLayout();
  var nests = [
    layout.getNest('main', 'left'),
    layout.getNest('main', 'left', 'top'),
    layout.getNest('main', 'left', 'bottom'),
    layout.getNest('main', 'center', 'top'),
    layout.getNest('main', 'center', 'bottom'),
    layout.getNest('main', 'right'),
    layout.getNest('main', 'right', 'top'),
    layout.getNest('main', 'right', 'bottom')
  ];

  var counter = bad.utils.privateCounter();
  var callback = function(nest) {
    nest.hide();
    if (counter() === nests.length) {
      counter = null;
      fn();
    }
  };

  goog.array.forEach(nests, function(nest) {
    nest.slideClosed(goog.bind(callback, this, nest));
  }, this);
};

app.base.view.Persistent.prototype.setActiveView = function(view) {
  this.activeView_ = view;
};
