goog.provide('app.base.view.Persistent');

goog.require('app.base.EventType');
goog.require('app.base.panel.Persistent');
goog.require('bad.ui.View');

/**
 * @constructor
 * @extends {bad.ui.View}
 */
app.base.view.Persistent = function(mqtt) {
    this.mqtt = mqtt;
    bad.ui.View.call(this);
};
goog.inherits(app.base.view.Persistent, bad.ui.View);

app.base.view.Persistent.prototype.configurePanels = function() {
    var layout = this.getLayout();
    var user = this.getUser();

    this.headerPanel = new app.base.panel.Persistent(this.mqtt);
    this.headerPanel.setUri(new goog.Uri('/header'));
    this.headerPanel.setUser(user);
    this.headerPanel.setNestAsTarget(layout.getNest('header'));
    this.addPanelToView(bad.utils.makeId(), this.headerPanel);
};

app.base.view.Persistent.prototype.displayPanels = function() {
    this.headerPanel.renderWithTemplate();
};

/**
 * @param {goog.events.EventLike} e Event object.
 */
app.base.view.Persistent.prototype.onPanelAction = function(e) {

    var value = e.getValue();
    var data = e.getData();

    switch (value) {
        case app.base.EventType.EDIT_ACCOUNT:
        case app.base.EventType.EDIT_PW:
            this.appDo(app.doMap.VIEW_EDIT_USER, value);
            break;
        case app.base.EventType.EDIT_ORG:
            console.debug('SO HERE WE ARE: A day later and a $ poorer, and ' +
                'still no org func.');
            break;
        default:
            console.log('app.base.view.Persistent No case for: ', value, data);
    }
};
