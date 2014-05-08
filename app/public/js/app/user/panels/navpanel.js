goog.provide('app.user.panel.NavPanel');

goog.require('app.base.NavPanel');
goog.require('app.user.EventType');
goog.require('goog.dom');

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

app.user.panel.NavPanel.prototype.resetMenu = function() {
  goog.dom.setTextContent(
      this.nameEl_,
      /** @type {string} */ (this.getUser().getSalutation())
  );
  this.menu_.unStickAll();
};
