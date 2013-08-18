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
    this.menu_ = bad.utils.makeMenu(
        menuItems, this.dom_, this.getHandler(), this, renderer,
        itemRenderer, stickySelect);

    this.addChild(this.menu_);
    this.menu_.render(this.getElement());
    var menuElement = this.menu_.getElement();
    goog.dom.classes.add(menuElement, 'well', 'menu-nav');

    this.appendMenuTitle();
};

app.user.panel.NavPanel.prototype.appendMenuTitle = function() {

    var user = this.getUser();
    var salutation = this.user_['name'];
    if (this.user_['surname']) {
        salutation = salutation + ' ' + this.user_['surname'];
    }

    if (user) {
        var child = this.dom_.createDom('div', {
            style: 'padding-left: 28px; ' +
                'border-bottom: 1px solid rgb(204, 204, 204)'
        },
        this.dom_.createDom('h3', {
            style: 'margin: 0'
        }, salutation));
        this.dom_.insertChildAt(
            this.dom_.getElementByClass('menu-nav',
                this.getElement()), child, 0);
        this.getHandler().listen(
            child,
            goog.events.EventType.CLICK,
            function() {
                this.dispatchActionEvent(app.user.EventType.VIEW_ACCOUNT);
            }, undefined, this
        );
    }
};

app.user.panel.NavPanel.prototype.resetMenu = function() {
    this.menu_.unStickAll();
};
