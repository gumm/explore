goog.provide('app.base.view.Home');

goog.require('app.base.panel.Home');
goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Home = function(mqtt) {
  bad.ui.View.call(this);

  this.mqtt = mqtt;
};
goog.inherits(app.base.view.Home, bad.ui.View);

app.base.view.Home.prototype.configurePanels = function() {
  var layout = this.getLayout();
  var user = this.getUser();

  var homePanel = new app.base.panel.Home();
  homePanel.setUri(new goog.Uri(exp.urlMap.BASIC.HOME));
  homePanel.setUser(user);
  homePanel.setMqtt(this.mqtt);
  homePanel.setNestAsTarget(layout.getNest('main', 'center'));
  this.addPanelToView(bad.utils.makeId(), homePanel);
  homePanel.renderWithTemplate();
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.view.Home.prototype.onPanelAction = function(e) {

  var value = e.getValue();
  var data = e.getData();
  e.stopPropagation();

  switch (value) {
    default:
      console.log('app.base.view.Home No action for: ', value, data);
  }
};
