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

    this.orgProfile_ = null;
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

    this.addChild(menu);
    menu.render(this.getElement());
    var menuElement = menu.getElement();
    goog.dom.classes.add(menuElement, 'well', 'menu-nav');

    this.appendMenuTitle(menu);
};

app.org.panel.NavPanel.prototype.appendMenuTitle = function(menu) {
    if (this.orgProfile_) {
        var child = this.dom_.createDom('div', {
            style: 'padding-left: 28px; ' +
                'border-bottom: 1px solid rgb(204, 204, 204)'
        },
        this.dom_.createDom('h3', {
            style: 'margin: 0'
        }, this.orgProfile_['orgName']));
        this.dom_.insertChildAt(
            this.dom_.getElementByClass('menu-nav',
                this.getElement()), child, 0);
        this.getHandler().listen(
            child,
            goog.events.EventType.CLICK,
            function() {
                menu.unStickAll();
                this.dispatchActionEvent(app.org.EventType.CANCEL);
            }, undefined, this
        );
    }
};

/**
* @param {goog.events.EventLike} e Event object.
*/
app.org.panel.NavPanel.prototype.onOrgInfo = function(e) {
    var xhr = e.target;
    var data = xhr.getResponseJson();
    if (xhr.isSuccess()) {
        this.orgProfile_ = data['data'];
    } else {
        this.orgProfile_ = '';
        console.debug('Oops Error --- ', data);
    }
};
