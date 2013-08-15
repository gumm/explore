goog.provide('app.user.panel.NavPanel');

goog.require('bad.ui.Form');
goog.require('bad.ui.MenuFlatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('goog.style');
goog.require('goog.ui.CustomButton');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.user.panel.NavPanel = function(opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.user.panel.NavPanel, bad.ui.Panel);

app.user.panel.NavPanel.prototype.initDom = function() {
    this.buildNavMenu();
};

app.user.panel.NavPanel.prototype.buildNavMenu = function() {

    var menuItems = [
        ['Edit your Profile', 'icon-user', goog.bind(this.dispatchActionEvent,
            this, app.user.EventType.EDIT_ACCOUNT)],
        ['Security Settings', 'icon-key', goog.bind(this.dispatchActionEvent,
            this, app.user.EventType.EDIT_PW)],
        ['Organizations', 'icon-building', goog.bind(this.dispatchActionEvent,
            this, app.user.EventType.VIEW_ORG)],

        // TODO: Implement these...
        ['Notification Center', 'icon-flag', goog.nullFunction]
    ];

    var renderer = bad.ui.MenuFlatRenderer.getInstance();
    var itemRenderer = bad.ui.MenuItemRenderer.getInstance();
    var stickySelect = true; // This keeps the last selected item highlighted.
    var menu = bad.utils.makeMenu(
        menuItems, this.dom_, this.getHandler(), this, renderer,
        itemRenderer, stickySelect);

    menu.render(this.getElement());
    var menuElement = menu.getElement();
    goog.dom.classes.add(menuElement, 'well', 'menu-nav');
};
