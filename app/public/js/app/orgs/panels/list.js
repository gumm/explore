goog.provide('app.org.panel.List');

goog.require('bad.ui.Panel');

/**
 * A delete account confirmation form.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.org.panel.List = function(opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.org.panel.List, bad.ui.Panel);

app.org.panel.List.prototype.enterDocument = function() {
    this.dom_ = goog.dom.getDomHelper(this.getElement());
    this.initDom();

    // Calling this last makes sure that the final PANEL-READY event really is
    // dispatched right at the end of all of the enterDocument calls.
    app.org.panel.List.superClass_.enterDocument.call(this);
};

app.org.panel.List.prototype.initDom = function() {

    var buttonElement = goog.dom.getElement('create-org');
    var tableElement = goog.dom.getElement('orgTable');

    if(buttonElement) {
        bad.utils.makeButton('create-org',
            goog.bind(this.dispatchActionEvent, this, app.doMap.VIEW_ORG_CREATE)
        );
    }

    if (tableElement) {
        var table = new bad.ui.Component();
        table.element_ = tableElement;
        table.setTarget(goog.dom.getElement('orgContainer'));
        this.addChild(table);

        this.getHandler().listen(
            table.element_,
            goog.events.EventType.CLICK,
            this.goGetTheCompanyWithThisId,
            false,
            this
        );

        goog.array.forEach(goog.dom.getChildren(goog.dom.getElement('orgBody')),
        function(el) {
            goog.dom.classes.add(el, 'clickable');
        }, this);
    }
};

app.org.panel.List.prototype.goGetTheCompanyWithThisId = function(e) {
    var orgId = null;
    if (e.target.nodeName === 'TD') {
        var rowElement = e.target.parentElement;
        orgId = rowElement.id;
    }
    this.dispatchActionEvent(app.user.EventType.EDIT_ORG, {id:orgId});
};