goog.provide('app.org.panel.NavPanel');

goog.require('bad.ui.Form');
goog.require('bad.ui.MenuFlatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('goog.style');
goog.require('goog.ui.CustomButton');

/**
 * An organization nav panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.org.panel.NavPanel = function(opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.org.panel.NavPanel, bad.ui.Panel);

app.org.panel.NavPanel.prototype.initDom = function() {
    this.buildNavMenu();
};

app.org.panel.NavPanel.prototype.buildNavMenu = function() {

    var menuItems = [
        ['Organization Profile', 'icon-building',
            goog.bind(this.dispatchActionEvent, this,
                app.org.EventType.UPDATE_PROFILE)],
        ['Billing', 'icon-credit-card', goog.bind(this.dispatchActionEvent,
            this, app.org.EventType.UPDATE_BILLING)],

        // TODO: Implement these...
        ['Payment History', 'icon-calendar', goog.nullFunction],
        ['Owners', 'icon-user', goog.nullFunction],
        ['Members', 'icon-group', goog.nullFunction]
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
