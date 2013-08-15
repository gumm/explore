goog.provide('app.org.panel.NavPanel');

goog.require('bad.ui.Form');
goog.require('bad.ui.MenuFlatRenderer');
goog.require('bad.ui.MenuItemRenderer');
goog.require('goog.style');
goog.require('goog.ui.CustomButton');

/**
 * A delete account confirmation form.
 * @param {string} orgId Active organisation's ID.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.org.panel.NavPanel = function(orgId, opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);

    /**
     * @type {string}
     * @private
     */
    this.activeOrgId_ = orgId;
};
goog.inherits(app.org.panel.NavPanel, bad.ui.Panel);

app.org.panel.NavPanel.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.org.panel.NavPanel.superClass_.enterDocument.call(this);
};

app.org.panel.NavPanel.prototype.initDom = function() {
    this.buildNavMenu();
};

app.org.panel.NavPanel.prototype.buildNavMenu = function() {

    var menuItems = [
        ['Edit Organization Profile', 'icon-building',
            goog.bind(this.dispatchActionEvent, this,
                app.org.EventType.UPDATE_PROFILE)],
        ['Security Settings', 'icon-key', goog.bind(this.dispatchActionEvent,
            this, app.org.EventType.UPDATE_SECURITY)],
        ['Emails', 'icon-envelope', goog.bind(this.dispatchActionEvent,
            this, app.org.EventType.UPDATE_EMAILS)],
        ['Billing', 'icon-credit-card', goog.bind(this.dispatchActionEvent,
            this, app.org.EventType.UPDATE_BILLING)],

        // TODO: Implement these...
        ['Payment History', 'icon-calendar', goog.nullFunction],
        ['Owners', 'icon-user', goog.nullFunction],
        ['Members', 'icon-group', goog.nullFunction],
        ['SSH Keys', 'icon-lock', goog.nullFunction]
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