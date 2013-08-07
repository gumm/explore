goog.provide('app.user.panel.NavPanel');

goog.require('bad.ui.Form');
goog.require('goog.ui.CustomButton');

/**
 * A delete account confirmation form.
 * @param {!string} id The form element id.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.user.panel.NavPanel = function(id, opt_domHelper) {
    bad.ui.Panel.call(this, id, opt_domHelper);
};
goog.inherits(app.user.panel.NavPanel, bad.ui.Panel);

app.user.panel.NavPanel.prototype.enterDocument = function() {

    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.user.panel.NavPanel.superClass_.enterDocument.call(this);
};

app.user.panel.NavPanel.prototype.initDom = function() {
    this.buildNavMenu();
};

app.user.panel.NavPanel.prototype.buildNavMenu = function() {

    // Item Names & Callbacks
    var menuItems = [
        {
            name: bad.utils.getIconString('Edit your Profile', 'icon-user'),
            action: goog.bind(
                this.dispatchComponentEvent, this,
                app.user.EventType.EDIT_ACCOUNT)
        },
        {
            name: bad.utils.getIconString('Account Settings', 'icon-key'),
            action: goog.bind(
                this.dispatchComponentEvent, this,
                app.user.EventType.EDIT_PW)
        },
        {
            name: bad.utils.getIconString('Organizations', 'icon-group'),
            action: goog.bind(
                this.dispatchComponentEvent, this,
                app.base.EventType.EDIT_ORG)
        }
    ];

    // Menu
    var menu = new goog.ui.Menu(this.dom_);
    goog.array.forEach(menuItems, function(obj) {
        var item;
        if (obj.name) {
            item = new goog.ui.MenuItem(
                obj.name, {callback: obj.action}, this.dom_);
        } else {
            item = new goog.ui.MenuSeparator(this.dom_);
        }
        menu.addChild(item, true);
    }, this);

    var el = this.dom_.createDom('div', {
        style: 'margin:20px;right:100px;position: absolute;width:120px'
    });
    this.dom_.appendChild(this.element_, el);
    menu.render(el);

    this.getHandler().listen(
        menu,
        goog.ui.Component.EventType.ACTION,
        function(e) {
            e.target.getModel().callback();
        }
    );
};