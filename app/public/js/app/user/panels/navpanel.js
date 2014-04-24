goog.provide('app.user.panel.NavPanel');

goog.require('app.base.NavPanel');

/**
 * A user navigation menu.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.base.NavPanel}
 * @constructor
 */
app.user.panel.NavPanel = function(opt_domHelper) {
  app.base.NavPanel.call(this, opt_domHelper);
};
goog.inherits(app.user.panel.NavPanel, app.base.NavPanel);

app.user.panel.NavPanel.prototype.getMenuItems = function() {

  var menuList = [
    ['Edit your Profile', 'icon-user', goog.bind(this.dispatchActionEvent,
      this, app.user.EventType.EDIT_ACCOUNT)],
    ['Security Settings', 'icon-key', goog.bind(this.dispatchActionEvent,
      this, app.user.EventType.EDIT_PW)],
    ['Organizations', 'icon-building', goog.bind(this.dispatchActionEvent,
      this, app.user.EventType.VIEW_ORG)],

    // TODO: Implement these...
    ['Notification Center', 'icon-flag', goog.nullFunction]
  ];

  return menuList;

};

app.user.panel.NavPanel.prototype.addProvisionalMenuItems = function() {
  var callback = goog.bind(function(tokens) {
    console.debug('THIS WAS PASSED INTO THE CALLBACK!!!!', tokens);
    if (goog.array.contains(tokens, 'AV')) {
      console.debug('WE have AV');
      this.menu_.addListItem([
        'AirVantage', 'icon-circle-arrow-right',
        goog.bind(this.dispatchActionEvent, this, app.user.EventType.VIEW_AV)
      ]);
    }
  }, this);
  this.getUser().updateTokensList(callback);
};

app.user.panel.NavPanel.prototype.resetMenu = function() {
  goog.dom.setTextContent(this.nameEl_, this.getUser().getSalutation());
  this.menu_.unStickAll();
};
