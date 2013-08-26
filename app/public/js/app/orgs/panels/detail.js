goog.provide('app.org.panel.DetailPanel');

goog.require('app.org.EventType');
goog.require('bad.ui.Panel');


/**
 * An organization nav panel.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM helper.
 * @extends {bad.ui.Panel}
 * @constructor
 */
app.org.panel.DetailPanel = function(opt_domHelper) {
    bad.ui.Panel.call(this, opt_domHelper);
};
goog.inherits(app.org.panel.DetailPanel, bad.ui.Panel);

app.org.panel.DetailPanel.prototype.initDom = function() {
    var ownerLink = goog.dom.getElement('ownerLink');
    var ownerId = goog.dom.dataset.get(ownerLink, 'id');
    var editProfile = goog.dom.getElement('editContacts');
    var editPhysical = goog.dom.getElement('editPhysAddress');
    var editPostal = goog.dom.getElement('editPostalAddress');

    this.getHandler().listen(
        ownerLink,
        goog.events.EventType.CLICK,
        function() {
            this.dispatchActionEvent(app.org.EventType.VIEW_OWNER, ownerId);
        }, undefined, this
    ).listen(
        editPhysical,
        goog.events.EventType.CLICK,
        function() {
            this.dispatchActionEvent(app.org.EventType.UPDATE_PHYSICAL);
        }, undefined, this
    ).listen(
        editPostal,
        goog.events.EventType.CLICK,
        function() {
            this.dispatchActionEvent(app.org.EventType.UPDATE_POSTAL);
        }, undefined, this
    ).listen(
        editProfile,
        goog.events.EventType.CLICK,
        function() {
            this.dispatchActionEvent(app.org.EventType.UPDATE_PROFILE);
        }, undefined, this);
};

