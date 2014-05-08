goog.provide('app.org.panel.NavPanel');

goog.require('app.base.NavPanel');
goog.require('app.org.EventType');
goog.require('bad.OrgManager');
goog.require('goog.dom');

/**
 * An organization nav panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {app.base.NavPanel}
 * @constructor
 */
app.org.panel.NavPanel = function(opt_domHelper) {
  app.base.NavPanel.call(this, opt_domHelper);

  this.activeOrg_ = new bad.OrgManager();
};
goog.inherits(app.org.panel.NavPanel, app.base.NavPanel);

app.org.panel.NavPanel.prototype.getMenuItems = function() {
  return [
    ['Organization Profile', 'icon-building',
      goog.bind(this.dispatchActionEvent, this,
        app.org.EventType.UPDATE_PROFILE)],
    ['Billing', 'icon-credit-card', goog.bind(this.dispatchActionEvent,
      this, app.org.EventType.UPDATE_BILLING)],

    // TODO: Implement these...
    ['Payment History', 'icon-calendar', goog.nullFunction],
    ['Members', 'icon-group', goog.nullFunction]
  ];
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.org.panel.NavPanel.prototype.onOrgInfo = function(e) {
  var xhr = e.target;
  var data = xhr.getResponseJson();
  if (xhr.isSuccess()) {
    this.activeOrg_.updateData(data['data']);
    this.dispatchActionEvent(
      app.org.EventType.CHANGE_SCOPE,
      this.activeOrg_.getData()
    );
  } else {
    console.log('Oops Error --- ', data);
  }
};

app.org.panel.NavPanel.prototype.setOrg = function(org) {
  this.activeOrg_ = org;
};

app.org.panel.NavPanel.prototype.resetMenu = function() {
  goog.dom.setTextContent(this.nameEl_, this.activeOrg_.getName());
  this.menu_.unStickAll();
};
